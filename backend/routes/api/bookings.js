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
        booking.Spot.SpotImages.forEach(image => {
            if(image.preview === true) booking.Spot.previewImage = image.url;
        })
        delete booking.Spot.SpotImages
    });
    return res.json({
        "Bookings": bookingsArr
    })
});

//edit a booking
router.put('/:bookingId', requireAuth, async (req, res) => {
    const { bookingId } = req.params;
    const { startDate, endDate } = req.body;
    const existingStart = new Date(startDate);
    const existingEnd = new Date(endDate);

    if(existingEnd < existingStart){
        res.status(400);
        return res.json({
            "message": "Validation error",
            "statusCode": 400,
            "errors": {
                "endDate": "endDate cannot come before startDate"
            }
        });
    };
    const booking = await Booking.findByPk(bookingId);

    if(!booking){
        res.status(404);
        return res.json({
            "message": "Booking couldn't be found",
            "statusCode": 404
        })
    };

    if(req.user.id !== booking.userId) throw new Error("Booking must belong to the current user")

    if(existingEnd.getTime() < new Date().getTime()){
        res.status(403);
        return res.json({
            "message": "Past bookings can't be modified",
            "statusCode": 403
        });
    };

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

    const editBooking = await booking.update({
        startDate,
        endDate
    });
    return res.json(editBooking);
});

//delete a booking
router.delete('/:bookingId', requireAuth, async (req, res) => {
    const { user } = req;
    const { bookingId } = req.params;

    const booking = await Booking.findByPk(bookingId, {
        include: [
            {
                model: Spot
            }
        ]
    });

    if(!booking){
        res.status(404);
        return res.json({
            "message": "Booking couldn't be found",
            "statusCode": 404
        })
    };
    if((booking.userId !== user.id) && (user.id !== booking.Spot.ownerId)) throw new Error("Booking must belong to the current user or the Spot must belong to the current user");

    if(booking.startDate <= new Date()){
        res.status(403);
        return res.json({
            "message": "Bookings that have been started can't be deleted",
            "statusCode": 403
        })
    };

    await booking.destroy();
    return res.json({
        "message": "Successfully deleted",
        "statusCode": 200
    })

})



module.exports = router;
