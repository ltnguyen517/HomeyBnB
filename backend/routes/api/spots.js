const express = require("express");
const router = express.Router();

const { setTokenCookie, restoreUser, requireAuth } = require("../../utils/auth");
const { User, Spot, SpotImage, Review, ReviewImage, Booking, Sequelize } = require("../../db/models");
const { check } = require("express-validator");
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
})






module.exports = router;
