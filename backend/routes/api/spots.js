const express = require("express");
const router = express.Router();

const { setTokenCookie, restoreUser, requireAuth } = require("../../utils/auth");
const { User, Spot, SpotImage, Review, ReviewImage, Booking, Sequelize } = require("../../db/models");
const { check, body } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");
const { validateLogin } = require("./session");
const sequelize = require("sequelize");

//Get all Spots
router.get('/', async (req, res) => {
    const spots = await Spot.findAll({

        include: [
            {
                model: Review
            },
            {
                model: SpotImage
            }
        ]
    });

    const spotArr = [];
    spots.forEach(spot => {
        spotArr.push(spot.toJSON())
    });
    spotArr.forEach(spot => {
        let starsTotal = 0;
        spot.Reviews.forEach(review => {
            starsTotal += review.stars
        });
        spot.avgRating = starsTotal / spot.Reviews.length;
        delete spot.Reviews;
    });
    spotArr.forEach(spot => {
        spot.SpotImages.forEach(image => {
            if(image.preview) {
                spot.previewImage = image.url
            } else {
                spot.previewImage = null
            }
            delete spot.SpotImages;
        })
    });
    return res.json({
        "Spots": spotArr
    })
});

//Get all Spots owned by the Current User
router.get('/current', requireAuth, async (req, res) => {
    const spots = await Spot.findAll({
        where: {
            ownerId: req.user.id
        },
        include: [
            {
                model: Review
            },
            {
                model: SpotImage
            }
        ]
    });
    const spotArr = [];
    spots.forEach(spot => {
        spotArr.push(spot.toJSON())
    });
    spotArr.forEach(spot => {
        let starsTotal = 0;
        spot.Reviews.forEach(review => {
            starsTotal += review.stars
        });
        spot.avgRating = starsTotal / spot.Reviews.length;
        delete spot.Reviews
    });
    spotArr.forEach(spot => {
        spot.SpotImages.forEach(image => {
            if(image.preview){
                spot.previewImage = image.url
            } else {
                spot.previewImage = null
            }
            delete spot.SpotImages
        })
    });
    res.json({"Spots": spotArr})
});

//Get details of a Spot from an id
router.get('/:spotId', async (req, res) => {
    const spot = await Spot.findByPk(req.params.spotId)

    if(!spot){
        res.status(404);
        res.json({
            message: "Spot couldn't be found",
            statusCode: 404
        });
    };

    const reviewStars = await spot.getReviews({
        attributes: [[Sequelize.fn("AVG", Sequelize.col("stars")), "avgStarRating"]]
    });
    const avgStarRating = reviewStars[0].toJSON().avgStarRating;

    const numReviews = await Review.count({
        where: {
            spotId: spot.id
        }
    });
    const spotImages = await SpotImage.findAll({
        where: {
            spotId: spot.id
        },
        attributes: ['id', 'url', 'preview']
    });
    const user = await User.findByPk(spot.ownerId, {
        attributes: ['id', 'firstName', 'lastName']
    });

    res.json({
        id: spot.id,
        ownerId: spot.ownerId,
        address: spot.address,
        city: spot.city,
        state: spot.state,
        country: spot.country,
        lat: spot.lat,
        lng: spot.lng,
        name: spot.name,
        description: spot.description,
        price: spot.price,
        createdAt: spot.createdAt,
        updatedAt: spot.updatedAt,
        numReviews: numReviews,
        avgStarRating: avgStarRating,
        SpotImages: spotImages,
        Owner: user
    });
});

//Create a Spot
router.post('/', requireAuth, async (req, res) => {
    const { address, city, state, country, lat, lng, name, description, price, createdAt, updatedAt } = req.body;

    if(!address || !city || !state || !country || !lat || !lng || (name.length > 50) || !description || !price){
        return res.status(400).json({
            "message": "Validation Error",
            "statusCode": 400,
            "errors": {
                "address": "Street address is required",
                "city": "City is required",
                "state": "State is required",
                "country": "Country is required",
                "lat": "Latitude is not valid",
                "lng": "Longitude is not valid",
                "name": "Name must be less than 50 characters",
                "description": "Description is required",
                "price": "Price per day is required"
            }
        })
    }

    const newSpot = await Spot.create({
        ownerId: req.user.id,
        address,
        city,
        state,
        country,
        lat,
        lng,
        name,
        description,
        price,
        createdAt,
        updatedAt
    });
    res.status(201);
    return res.json(newSpot);
});

//Add an Image to a Spot based on the Spot's id
router.post('/:spotId/images', requireAuth, async (req, res) => {
    const { user } = req;
    const { spotId } = req.params;
    const { url, preview } = req.body;

    const spot = await Spot.findByPk(spotId);
    if(spot && (parseInt(user.id) === parseInt(spot.ownerId))){
        const newImg = await SpotImage.create({
            spotId,
            url,
            preview
        });
        return res.json({
            "id": newImg.id,
            "url": newImg.url,
            "preview": newImg.preview
        });
    } else {
        res.status(404);
        return res.json({
            "message": "Spot couldn't be found",
            "statusCode": 404
        });
    }
});

//Edit a Spot
router.put('/:spotId', requireAuth, async (req, res) => {
    const { user } = req;
    const { spotId } = req.params;
    const { address, city, state, country, lat, lng, name, description, price } = req.body;

    const spot = await Spot.findByPk(spotId);

    // const bodyErr = {
    //     "message": "Validation Error",
    //     "statusCode": 400,
    //     "errors": {}
    // };
    // if(!address) bodyErr.errors.address = "Street address is required";
    // if(!city) bodyErr.errors.city = "City is required";
    // if(!state) bodyErr.errors.state = "State is required";
    // if(!country) bodyErr.errors.country = "Country is required";
    // if(!lat) bodyErr.errors.lat = "Latitude is not valid";
    // if(!lng) bodyErr.errors.lng = "Longitude is not valid";
    // if(!name) bodyErr.errors.name = "Name must be less than 50 characters";
    // if(!description) bodyErr.errors.description = "Description is required";
    // if(!price) bodyErr.errors.price = "Price per day is required";

    if(!address || !city || !state || !country || !lat || !lng || (name.length > 50) || !description || !price){
        res.status(400);
        return res.json({
            "message": "Validation Error",
            "statusCode": 400,
            "errors": {
                "address": "Street address is required",
                "city": "City is required",
                "state": "State is required",
                "country": "Country is required",
                "lat": "Latitude is not valid",
                "lng": "Longitude is not valid",
                "name": "Name must be less than 50 characters",
                "description": "Description is required",
                "price": "Price per day is required"
            }
        // return res.json(bodyErr);
        })
    };


    if(spot && (spot.ownerId === user.id)) {
        await spot.update({
            address,
            city,
            state,
            country,
            lat,
            lng,
            name,
            description,
            price
        })
        return res.json(spot)
    } else {
        res.status(404);
        return res.json({
            "message": "Spot couldn't be found",
            "statusCode": 404
        });
    }
});

//Delete a Spot
router.delete('/:spotId', requireAuth, async (req, res) => {
    const { user } = req;
    const spot = await Spot.findByPk(req.params.spotId);

    if(spot && (user.id === spot.ownerId)){
        await spot.destroy();
        return res.json({
            "message": "Successfully deleted",
            "statusCode": 200
        });
    } else {
        res.status(404);
        return res.json({
            "message": "Spot couldn't be found",
            "statusCode": 404
        });
    };
});

//Get all reviews by a spot's id
router.get('/:spotId/reviews', async (req, res) => {
    const spot = await Spot.findByPk(req.params.spotId);

    if(spot){
        const reviews = await Review.findAll({
            where: {
                spotId: spots.id
            },
            attributes: ['id', 'userId', 'spotId', 'review', 'stars', 'createdAt', 'updatedAt'],
            include: [
                {
                    model: User,
                    attributes: ['id', 'firstName', 'lastName']
                },
                {
                    model: ReviewImage,
                    attributes: ['id', 'url']
                }
            ]
        })
        res.status(200);
        return res.json({
            "Reviews": reviews
        })
    } else {
        res.status(404);
        return res.json({
            "message": "Spot couldn't be found",
            "statusCode": 404
        })
    }
});

module.exports = router;
