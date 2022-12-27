const express = require('express');
const router = express.Router();
const { setTokenCookie, restoreUser, requireAuth } = require("../../utils/auth");
const { User, Spot, SpotImage, Review, ReviewImage, Booking } = require("../../db/models");
const { check } = require('express-validator');
const { handleValidationErrors } = require("../../utils/validation");
const { validateLogin } = require('./session');
const sequelize = require("sequelize");

//Delete a review image
router.delete('/:imageId', requireAuth, async (req, res) => {
    const { user } = req;
    const { imageId } = req.params;

    const existingReviewImg = await ReviewImage.findByPk(imageId, {
        include: [
            {
                model: Review,
                attributes: [ 'userId' ]
            }
        ]
    });
    if(!existingReviewImg){
        res.status(404);
        return res.json({
            "message": "Review Image couldn't be found",
            "statusCode": 404
        })
    };
    if(existingReviewImg.Review.userId !== user.id){
        throw new Error("Review must belong to the current user");
    } else {
        await existingReviewImg.destroy();
        return res.json({
            "message": "Successfully deleted",
            "statusCode": 200
        })
    };
});



module.exports = router;
