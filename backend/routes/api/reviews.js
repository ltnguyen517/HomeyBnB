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

//Add an image to a review based on the review's id
router.post('/:reviewId/images', requireAuth, async (req, res) => {
    const { user } = req;
    const { url } = req.body;
    const { reviewId } = req.params;
    const review = await Review.findByPk(reviewId);

    if(!review) {
        res.status(404);
        return res.json({
            "message": "Review couldn't be found",
            "statusCode": 404
        });
    };
    if(user.id !== review.userId) throw new Error("Review must belong to the current user");

    const everyReviewImg = await ReviewImage.findAll({
        where: {
            reviewId: reviewId
        }
    });
    if(everyReviewImg.length > 10){
        res.status(403);
        return res.json({
            "message": "Maximum number of images for this resource was reached",
            "statusCode": 403
        })
    };

    const newImgForReview = await ReviewImage.create({
        reviewId,
        url
    });
    res.status(200);
    return res.json({
        "id": newImgForReview.id,
        "url": newImgForReview.url
    });
});

//Edit a review
router.put('/:reviewId', requireAuth, async (req, res) => {
    const { user } = req;
    const { review, stars } = req.body;
    const { reviewId } = req.params;

    const updateReview = await Review.findByPk(reviewId);

    if(!updateReview){
        res.status(404);
        return res.json({
            "message": "Review couldn't be found",
            "statusCode": 404
        })
    };
    if(user.id !== updateReview.userId) throw new Error("Review must belong to the current user");

    const bodyError = {
        "message": "Validation error",
        "statusCode": 400,
        "errors": {}
    };
    if(!review) bodyError.errors.review = "Review text is required";
    if(!(stars >= 1 && stars <= 5)) bodyError.errors.stars = "Stars must be an integer from 1 to 5";
    if(!review || (!(stars >= 1 && stars <= 5))){
        res.status(400);
        return res.json(bodyError);
    };

    const putReview = await updateReview.update({
        review,
        stars,
    });
    res.status(200);
    return res.json(putReview);
});

//Delete a review

module.exports = router;
