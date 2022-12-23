const express = require("express");
const router = express.Router();

const { setTokenCookie, restoreUser, requireAuth } = require("../../utils/auth");
const { User, Spot, SpotImage, Review, ReviewImage, Booking, Sequelize } = require("../../db/models");
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");
const sequelize = require("sequelize");
const { validateLogin } = require("./session");

//Get all reviews of the current user
router.get('/current', requireAuth, async (req, res) => {
    const reviews = await Review.findAll({
        where: {
            userId: req.user.id
        },
        attributes: [
            'id',
            'userId',
            'spotId',
            'review',
            'stars',
            'createdAt',
            'updatedAt'
        ],
        include: [
            {
                model: User,
                attributes: ['id', 'firstName', 'lastName']
            },
            {
                model: Spot,
                attributes: {
                    exclude: ['description', 'createdAt', 'updatedAt']
                }
            },
            {
                model: ReviewImage,
                attributes: ['id', 'url']
            }
        ]
    });
    for(let i = 0; i < reviews.length; i++){
        reviews[i] = reviews[i].toJSON();
        let previewImage = await SpotImage.findOne({
            where: {
                spotId: reviews[i].spotId,
                preview: true
            }
        })
        if(previewImage){
            reviews[i].Spot.previewImage = previewImage.url
        } else {
            reviews[i].Spot.previewImage = null
        }
    }
    return res.json({
        "Reviews": reviews
    })
});




module.exports = router;
