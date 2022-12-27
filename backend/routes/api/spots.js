const express = require("express");
const router = express.Router();

const { setTokenCookie, restoreUser, requireAuth } = require("../../utils/auth");
const { User, Spot, SpotImage, Review, ReviewImage, Booking, Sequelize } = require("../../db/models");
const { check, body } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");
const { validateLogin } = require("./session");
const sequelize = require("sequelize");
const { Op } = require("sequelize");

//Get all Spots
router.get('/', async (req, res) => {
    let { page, size, minLat, maxLat, minLng, maxLng, minPrice, maxPrice } = req.query;

    const queryValErr = {
        "message": "Validation Error",
        "statusCode": 400,
        "errors": {}
    }

    if(minLat){
        minLat = Number(minLat);
        if(isNaN(minLat)){
            res.status(400);
            return queryValErr.errors.minLat = "Minimum latitude is invalid"
        }
    };
    if(maxLat){
        maxLat = Number(maxLat);
        if(isNaN(maxLat)){
            res.status(400);
            return queryValErr.errors.maxLat = "Maximum latitude is invalid"
        }
    };
    if(minLng){
        minLng = Number(minLng);
        if(isNaN(minLng)){
            res.status(400);
            return queryValErr.errors.minLng = "Minimum longitude is invalid"
        }
    };
    if(maxLng){
        maxLng = Number(maxLng);
        if(isNaN(maxLng)){
            res.status(400);
            return queryValErr.errors.maxLng = "Maximum longitude is invalid"
        }
    };
    if(minPrice){
        minPrice = Number(minPrice);
        if(isNaN(minPrice) || minPrice < 0){
            res.status(400);
            return queryValErr.errors.minPrice = "Minimum price must be greater than or equal to 0"
        };
    };
    if(maxPrice){
        maxPrice = Number(maxPrice);
        if(isNaN(maxPrice) || maxPrice < 0){
            res.status(400);
            return queryValErr.errors.maxPrice = "Maximum price must be greater than or equal to 0"
        };
    };
    if(page < 1){
        res.status(400);
        return queryValErr.errors.page = "Page must be greater than or equal to 1"
    };
    if(size < 1){
        res.status(400);
        return queryValErr.errors.size = "Size must be greater than or equal to 1"
    };

    page = parseInt(page);
    size = parseInt(size);
    if(!page) page = 1;
    if(!size) size = 20;
    if(page > 10) page = 10;
    if(size > 20) size = 20;

    const spots = await Spot.findAll({
        include: [
            {
                model: Review
            },
            {
                model: SpotImage
            }
        ],
        limit: size,
        offset: size * (page - 1)
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
        "Spots": spotArr,
        page,
        size
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

    const bodyValError = {
        "message": "Validation Error",
        "statusCode": 400,
        "errors": {}
    };

    if(!address) bodyValError.errors.address = "Street address is required";
    if(!city) bodyValError.errors.city = "City is required";
    if(!state) bodyValError.errors.state = "State is required";
    if(!country) bodyValError.errors.country = "Country is required";
    if(!lat) bodyValError.errors.lat = "Latitude is not valid";
    if(!lng) bodyValError.errors.lng = "Longitude is not vali";
    if(name.length > 50) bodyValError.errors.name = "Name must be less than 50 characters";
    if(!description) bodyValError.errors.description = "Description is required";
    if(!price) bodyValError.errors.price = "Price per day is required";


    if(!address || !city || !state || !country || !lat || !lng || (name.length > 50) || !description || !price){
        res.status(400);
        return res.json(bodyValError);
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
    } else if(spot && (parseInt(user.id) !== parseInt(spot.ownerId))) {
        throw new Error("Spot must belong to the current user")
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

    const bodyErr = {
        "message": "Validation Error",
        "statusCode": 400,
        "errors": {}
    };
    if(!address) bodyErr.errors.address = "Street address is required";
    if(!city) bodyErr.errors.city = "City is required";
    if(!state) bodyErr.errors.state = "State is required";
    if(!country) bodyErr.errors.country = "Country is required";
    if(!lat) bodyErr.errors.lat = "Latitude is not valid";
    if(!lng) bodyErr.errors.lng = "Longitude is not valid";
    if(name.length > 50) bodyErr.errors.name = "Name must be less than 50 characters";
    if(!description) bodyErr.errors.description = "Description is required";
    if(!price) bodyErr.errors.price = "Price per day is required";

    if(!address || !city || !state || !country || !lat || !lng || (name.length > 50) || !description || !price){
        res.status(400);
        return res.json(bodyErr);
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
    } else if(spot && (spot.ownerId !== user.id)){
        throw new Error("Spot must belong to the current user")
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
    } else if(spot && (spot.ownerId !== user.id)){
        throw new Error("Spot must belong to the current user")
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
                spotId: spot.id
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

//Create a review for a spot based on the spot's id
router.post('/:spotId/reviews', requireAuth, async (req, res) => {
    const id = req.user.id;
    const { spotId } = req.params;
    const { review, stars } = req.body;

    const spot = await Spot.findByPk(spotId);

    if(!spot){
        res.status(404);
        return res.json({
            "message": "Spot couldn't be found",
            "statusCode": 404
        });
    };

    const existingReview = await Review.findOne({
        where: {
            userId: id,
            spotId: spotId
        }
    });
    if(existingReview){
        res.status(403);
        return res.json({
            "message": "User already has a review for this spot",
            "statusCode": 403
        })
    };

    const bodyValErr = {
        "message": "Validation error",
        "statusCode": 400,
        "errors": {}
    };
    if(!review) bodyValErr.errors.review = "Review text is required";
    if(stars < 1 || stars > 5) bodyValErr.errors.stars = "Stars must be an integer from 1 to 5";
    if(!review || (stars < 1 || stars > 5)){
        res.status(400);
        return res.json(bodyValErr)
    };

    const brandNewReview = await Review.create({
        userId: id,
        spotId: spot.id,
        review,
        stars
    });
    res.status(201);
    return res.json(brandNewReview);
});

//Get all Bookings for a Spot based on the Spot's id
router.get('/:spotId/bookings', requireAuth, async (req, res) => {

    const spot = await Spot.findByPk(req.params.spotId);

    if(!spot){
        res.status(404);
        return res.json({
            "message": "Spot couldn't be found",
            "statusCode": 404
        });
    };

    const publicBookings = await Booking.findAll({
        where: {
            spotId: req.params.spotId
        },
        attributes: ['spotId', 'startDate', 'endDate']
    });
    const ownersBookings = await Booking.findAll({
        where: {
            spotId: req.params.spotId
        },
        include: [
            {
                model: User,
                attributes: ['id', 'firstName', 'lastName']
            }
        ]
    });

    const publicBookingsArr = [];
    publicBookings.forEach(booking => {
        publicBookingsArr.push(booking.toJSON())
    });

    const ownersBookingsArr = [];
    ownersBookings.forEach(booking => {
        ownersBookingsArr.push(booking.toJSON())
    });

    if(req.user.id !== spot.ownerId){
        return res.json({
            "Bookings": publicBookingsArr
        })
    } else {
        return res.json({
            "Bookings": ownersBookingsArr
        })
    }
});

//Create a Booking from a Spot based on the Spot's id
router.post('/:spotId/bookings', requireAuth, async (req, res) => {
    const { startDate, endDate } = req.body;
    const { spotId } = req.params;
    const existingStart = new Date(startDate);
    const existingEnd = new Date(endDate);

    const spot = await Spot.findByPk(spotId);

    if(!spot){
        res.status(404);
        return res.json({
            "message": "Spot couldn't be found",
            "statusCode": 404
        })
    };
    if(req.user.id === spot.ownerId) throw new Error("Spot must NOT belong to the current user")

    if(existingEnd <= existingStart){
        res.status(400);
        return res.json({
            "message": "Validation error",
            "statusCode": 400,
            "errors": {
                "endDate": "endDate cannot be on or before startDate"
            }
        });
    };

    const bookingConflict = await Booking.findAll({
        where: {
            spotId
        }
    });
    for(let i = 0; i < bookingConflict.length; i++){
        const booking = bookingConflict[i];
        const newStart = new Date(booking.startDate);
        const newEnd = new Date(booking.endDate);

        if(existingEnd.getTime() >= newStart.getTime() && existingStart.getTime() <= newEnd.getTime()){
            res.status(403);
            return res.json({
                "message": "Sorry, this spot is already booked for the specified dates",
                "statusCode": 403,
                "errors": {
                "startDate": "Start date conflicts with an existing booking",
                "endDate": "End date conflicts with an existing booking"
                }
            });
        };
    };

    const newBooking = await Booking.create({
        spotId: spot.id,
        userId: req.user.id,
        startDate,
        endDate
    })
    res.status(200);
    return res.json(newBooking);
});



module.exports = router;
