// const express = require("express");

// const router = express.Router();

// const feedController = require("../controller/feed");

// const isAuth = require("../middleware/is-auth");

// const { body } = require("express-validator");
// // GET  /feed/post
// router.get("/post", isAuth, feedController.getPosts);

// // GET  /feed/post/:id
// router.get("/post/:id", isAuth, feedController.getData)

// // POST  /feed/post
// router.post("/post", isAuth, [
//     body("title").trim().isLength({ min: 5 }),
//     body("content").trim().isLength({ min: 5 })
// ], feedController.createPost);

// // PUT /feed/postupdate/:id
// router.put('/postupdate/:id', isAuth, [
//     body("title").trim().isLength({ min: 5 }),
//     body("content").trim().isLength({ min: 5 })
// ], feedController.updatePost);

// // PUT /feed/post/:id
// router.delete("/post/:id", isAuth, feedController.deletePost);

// module.exports = router;