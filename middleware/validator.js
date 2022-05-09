const { body, validationResult } = require("express-validator");

const User = require("../models/users");

const printError = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
        return res.status(422).json({ errors: errors.array() });
    next();
}

exports.signUpValid = [
    body("name")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Please Enter Name"),
    body("email")
    .isEmail()
    .withMessage("Please Enter Valid Email")
    .custom((value, { req }) => {
        return User.findOne({ "email": value }).then(userDoc => {
            if (userDoc) {
                return Promise.reject("Email already exist");
            }
            return true;
        })
    })
    .normalizeEmail(),
    body("password")
    .notEmpty()
    .withMessage("Plese Enter Password")
    .trim()
    .isLength({ min: 5 })
    .withMessage("Password length should be more then 5 character"),
    body("confirmPassword").trim()
    .notEmpty().withMessage("Please enter Confirm Password")
    .custom((value, { req }) => {
        if (value !== req.body.password) {
            return Promise.reject("Password doesn't match");
        }
        return true;
    }),
    printError
];

exports.loginValid = [
    body("email")
    .isEmail()
    .withMessage("Please Enter Valid Email")
    .normalizeEmail(),
    body("password")
    .trim()
    .isLength({ min: 5 })
    .withMessage("Please enter password"),
    printError
];


exports.postValid = [
    body("caption").trim(),
    printError
];