const express = require('express');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const router = express.Router();


const validateSignup = [
    check('firstName')
      .exists({ checkFalsy: true })
      .withMessage('First Name is required'),
    check('lastName')
      .exists({ checkFalsy: true })
      .withMessage('Last Name is required'),
    check('email')
      .exists({ checkFalsy: true })
      .isEmail()
      .withMessage('Please provide a valid email.'),
    check('username')
      .exists({ checkFalsy: true })
      .isLength({ min: 4 })
      .withMessage('Please provide a username with at least 4 characters.'),
    check('username')
      .not()
      .isEmail()
      .withMessage('Username cannot be an email.'),
    check('password')
      .exists({ checkFalsy: true })
      .isLength({ min: 6 })
      .withMessage('Password must be 6 characters or more.'),
    handleValidationErrors
  ];


//Sign Up a User
router.post(
    '/',
    validateSignup,
    async (req, res) => {
      const { firstName, lastName, email, password, username } = req.body;

      const existingEmailErr = await User.findOne({
        where: { email }
      });
      if(existingEmailErr) {
        res.status(403);
        return res.json({
          message: "User already exists",
          statusCode: 403,
          errors: {
            email: "User with that email already exists"
          }
        })
      };

      const existingUsernameErr = await User.findOne({
        where: { username }
      });
      if(existingUsernameErr){
        res.status(403);
        return res.json({
          message: "User already exists",
          statusCode: 403,
          errors: {
            username: "User with that username already exists"
          }
        })
      };

      const bodyValErr = {
        message: "Validation error",
        statusCode: 400,
        errors: {}
      };
      if(!email) bodyValErr.errors.email = "Invalid email";
      if(!username) bodyValErr.errors.username = "Username is required";
      if(!firstName) bodyValErr.errors.firstName = "First Name is required";
      if(!lastName) bodyValErr.errors.lastName = "Last Name is required";
      if(!email || !username || !firstName || !lastName){
        res.status(400);
        return res.json(bodyValErr)
      };

      const user = await User.signup({ firstName, lastName, email, username, password });

      await setTokenCookie(res, user);

      return res.json({
        user: user
      });
    }
);





module.exports = router;
