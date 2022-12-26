const express = require('express');
const router = express.Router();
const { setTokenCookie, restoreUser, requireAuth } = require("../../utils/auth");
const { User, Spot, SpotImage, Review, ReviewImage, Booking } = require("../../db/models");
const { check } = require('express-validator');
const { handleValidationErrors } = require("../../utils/validation");
const { validateLogin } = require('./session');
const sequelize = require("sequelize");

//Delete a spot image
router.delete('/:imageId', requireAuth, async (req, res) => {
    const { user } = req;
    const { imageId } = req.params;

    const image = await SpotImage.findByPk(imageId);
    
    if(!image){
        res.status(404);
        return res.json({
            "message": "Spot Image couldn't be found",
            "statusCode": 404
        })
    };

    const spot = await Spot.findByPk(image.spotId);

    if(user.id !== spot.ownerId) {
        throw new Error("Spot must belong to the current user")
    } else {
        await image.destroy();
        return res.json({
            "message": "Successfully deleted",
            "statusCode": 200
        })
    }
});


module.exports = router;
