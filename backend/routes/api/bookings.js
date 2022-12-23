const express = require('express');
const router = express.Router();
const { setTokenCookie, restoreUser, requireAuth } = require("../../utils/auth");
const { User, Spot, SpotImage, Review, ReviewImage, Booking } = require("../../db/models");
const { check } = require('express-validator');
const { handleValidationErrors } = require("../../utils/validation");
const { validateLogin } = require('./session');
const sequelize = require("sequelize");

//Get all current user's bookings
router.get('/current', requireAuth, async (req, res) => {
    const userBookings = await Booking.findAll({
        where: {
            userId: req.user.id
        },
        include: [
            {
                model: Spot,
                attributes: {
                    exclude: ['description', 'createdAt', 'updatedAt']
                },
                include: [
                    {
                        model: SpotImage
                    }
                ]
            }
        ]
    });

    const bookingsArr = [];
    userBookings.forEach(booking => {
        bookingsArr.push(booking.toJSON())
    });
    bookingsArr.forEach(booking => {
        booking.Spot.SpotImage.forEach(image => {
            if(image.preview === true) booking.Spot.previewImage = image.url;
        })
        delete booking.Spot.SpotImage
    });
    return res.json({
        "Bookings": bookingsArr
    })
});

//






module.exports = router;
