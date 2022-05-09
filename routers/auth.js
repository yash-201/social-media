// const express = require("express");

// const router = express.Router();

// const authController = require("../controller/auth");

// const { body } = require("express-validator");

// const User = require("../models/user");

// const isAuth = require("../middleware/is-auth");

// router.put("/signup", [
//     body("email")
//     .isEmail()
//     .withMessage("Please Enter Valid Email")
//     .custom((value, { req }) => {
//         return User.findOne({ "email": value }).then(userDoc => {
//             if (userDoc) {
//                 return Promise.reject("Email already exist");
//             }
//             return true;
//         })
//     }).normalizeEmail(),
//     body("password")
//     .trim()
//     .isLength({ min: 5 }),
//     body("name")
//     .trim()
//     .not()
//     .isEmpty()
// ], authController.signup);


// router.post("/login", [
//     body("email")
//     .isEmail()
//     .withMessage("Please Enter Valid Email")
//     .normalizeEmail(),
//     body("password")
//     .trim()
//     .isLength({ min: 5 })
// ], authController.login);


// router.get("/status", isAuth, authController.getUserState);

// router.patch("/status", isAuth, [
//     body("status")
//     .trim()
//     .not()
//     .isEmpty()
// ], authController.updateUserState);

// module.exports = router;