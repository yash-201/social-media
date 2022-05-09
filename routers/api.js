const express = require("express");

const router = express.Router();

const User = require("../models/users");

const isAuth = require("../middleware/is-auth");

const uploadPost = require("../middleware/fileUpload");

const validator = require("../middleware/validator")

const apiController = require("../controller/api");

const messageController = require("../controller/message");

const authController = require("../controller/auth");

router.post("/signup", validator.signUpValid, authController.signup);

router.post("/login", validator.loginValid, authController.login);

// router.route("/user").get(apiController.createPost).post(apiController.createPost)

router.route("/user")
    .get(isAuth, apiController.getUser)
    .patch(isAuth, uploadPost("images"), apiController.updateProfile)

// router.get("/user", isAuth, apiController.getUser);

// router.patch("/updateProfile", isAuth, uploadPost("images"), apiController.updateProfile);

router.route("/post")
    .get(isAuth, apiController.getPosts)
    .post(isAuth, validator.postValid, uploadPost("images/post"), apiController.createPost)

// router.get("/getpost", isAuth, apiController.getPosts);

// router.post("/post", isAuth, validator.postValid, uploadPost("images/post"), apiController.createPost);

router.delete("/delete/post/:pid", isAuth, apiController.deletePost);

router.get("/getUserPost", isAuth, apiController.getPosts);

router.get("/getallUser", isAuth, apiController.getAllUsers);

router.put("/like/:pid", isAuth, apiController.likeAPost);

router.get("/demo-aggregation", isAuth, apiController.getAggregation);

router.get("/demo", isAuth, apiController.demo);

router.post("/logout", isAuth, authController.logout);

// Message routers

router.post("/message/addmsg", isAuth, messageController.addMessage);

router.post("/message/getmsg", isAuth, messageController.getAllMessage);

router.delete("/message/delete/chats", isAuth, messageController.deleteChat);

router.delete("/message/delete/chat/:cid", isAuth, messageController.deleteSingleMessage);

module.exports = router;