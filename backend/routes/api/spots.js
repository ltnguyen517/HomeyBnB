const express = require("express");
const router = express.Router();

const { setTokenCookie, restoreUser, requireAuth } = require("../../utils/auth");
const { User, Spot, SpotImage, Review, ReviewImage, Booking } = require("../../db/models");
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

})






module.exports = router;
