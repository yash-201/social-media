const User = require("../models/users");

const { response } = require("express");

const Post = require("../models/posts");

const path = require("path");

const fs = require("fs");

const { dirname, join } = require("path");

const io = require("../socket");

const Like = require("../models/likes");

// const session = require('express-session');

const { default: mongoose } = require("mongoose");

exports.getAggregation = async(req, res, next) => {
    console.log(req.userId);
    const user = await Post.aggregate([
        //{
        //    $match: { creator: mongoose.Types.ObjectId(req.userId) }
        //},
        {
            $group: { _id: "$creator", totalPost: { $sum: 1 } }
        }

    ]);
    await User.populate(user, {
        path: '_id',
        select: "-password"
    });
    res.status(200).json({ message: "success", results: user.length, data: user });
}

exports.demo = async(req, res, next) => {
    const user = new Post.find();
    console.log(user);
}

exports.getPosts = async(req, res, next) => {
    try {
        // const demo = await Post.find();
        // console.log(demo);

        //pagination
        const page = req.query.page * 1 || 1;
        const limit = req.query.limit * 1 || 100;
        const skip = (page - 1) * limit;

        //page=2&limit=10  1-10 page1   11-20 page 2     21-30 page3
        let isLike = false;
        let query = Post.find()
            .populate("creator", "name image")
            .sort("-createdAt")
            .skip(skip).limit(limit);
        // console.log(req.originalUrl);
        if (req.originalUrl == "/api/getUserPost") {
            query = query.find({ creator: req.userId });
        }
        const posts = await query;

        if (req.query.page) {
            const numOfPost = await Post.countDocuments();
            if (skip >= numOfPost) {
                return res.status(404).json({
                    status: "fail",
                    message: "Page Not Found",
                    data: null
                })
            }
        }
        const combinedPost = [];
        for (let p of posts) {
            let sPost = {};
            isLike = false;

            const checkExistLike = await Like.findOne({ userId: req.userId, postId: p._id });
            if (checkExistLike) {
                isLike = true;
            }
            const totalLike = await Like.find({ postId: p._id }).countDocuments();
            sPost = {...p._doc, isLike, postTime: p.postTime, totalLike: totalLike };
            combinedPost.push(sPost);
        }

        // posts.map(async p => {
        //     const checkExistLike = await Like.findOne({ userId: req.userId, postId: p._id });
        //     isLike = false;
        //     let sPost = {};
        //     if (checkExistLike) {
        //         isLike = true;
        //     }
        //     // console.log(checkExistLike);
        //     // p.isLike = isLike;
        //     // console.log(p);
        //     sPost = {...p._doc, isLike };
        //     combinedPost.push(sPost);
        //     // return p;
        // });

        // const data = appendLike.then(result => {
        //     return result;
        // })
        // console.log(data);
        // console.log(combinedPost);
        res.status(200).json({
            message: "Display all the posts",
            result: combinedPost.length,
            posts: combinedPost
        });
    } catch (err) {
        next(err);
    }
};

exports.createPost = async(req, res, next) => {
    // console.log(req.file);
    // console.log("/images/post/" + req.file.filename);
    const caption = req.body.caption;
    const imageUrl = "/images/post/" + req.file.filename;
    try {
        const post = new Post({
            image: imageUrl,
            caption: caption,
            creator: req.userId,
            date: new Date().getTime()
        });

        await post.save();
        const getPosts = await Post.findById(post._id).populate("creator", "name image");
        IOfunction("posts", "create", getPosts)
            // io.getIO().emit('posts', {
            //     action: 'create',
            //     post: getUserName
            // });
        res.status(201).json({
            message: "Post created successfully",
            post: post
                // post: {..post._doc, creator :{} }
        });
    } catch (err) {
        next(err);
    }
}

exports.getUser = async(req, res, next) => {
    // console.log(pid);
    try {
        const uid = req.userId;
        const user = await User.findById(uid)
            .select("-password");
        if (!user) {
            res.status(404).json({ message: "did not find user records" });
        }
        res.status(200).json({ message: "user fetched", data: user });
    } catch (err) {
        next(err);
    }
}

exports.updateProfile = async(req, res, next) => {
    try {
        const uid = req.userId;
        // const name = req.body.name;
        // const email = req.body.email;
        let image = req.body.image;
        if (req.file) {
            image = "/" + req.file.path;
        }

        if (!image) {
            return res.status(422).json({ message: "File Not Found" });
        }

        const user = await User.findById(uid)
            .select("-password")
        if (!user) {
            return res.status(404).json({ message: "Post Not Found" });
        }
        if (user.image) {
            clearImage(user.image);
        }
        // user.name = name;
        // user.email = email;
        user.image = image;
        const result = await user.save();


        return res.status(200).json({
            message: "records updated succsessfully",
            post: result
        })
    } catch (err) {
        next(err);
    }
}

exports.deletePost = async(req, res, next) => {
    try {
        const pid = req.params.pid;
        const post = await Post.findById(pid)
        let result = "";
        if (!post) {
            const error = new Error("Could not find a post");
            error.statusCode = 404;
            throw error;
        }
        const userCheck = await User.findOne({ _id: req.userId });
        if (userCheck.isAdmin) {
            result = await Post.findByIdAndRemove(pid);
        } else {
            if (post.creator.toString() != req.userId) {
                return res.status(403).json({ message: "authentication error" });
            }
            result = await Post.findByIdAndRemove(pid);
        }
        clearImage(post.image);
        await Like.deleteMany
        const getPosts = await Post.find().sort("-createdAt").populate("creator", "name image");
        IOfunction("posts", "delete", getPosts)
            // console.log(getPosts);

        return res.status(200).json({
            message: "succsessfully deleted",
            data: result,
            error: null
        })
    } catch (err) {
        next(err);
    }
}

exports.getAllUsers = async(req, res, next) => {
    try {
        let query = JSON.stringify(req.query);
        let users;
        let queryRun;
        // 2. advanced filter
        query = query.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
        query = User.find(JSON.parse(query));
        // User.find({ "authors": { "$regex": "Alex", "$options": "i" } })

        if (req.query.fields) {
            let sortInMulti = req.query.fields.split(",").join(" ");
            console.log(sortInMulti);
            query = query.find().select(sortInMulti);
        }
        if (req.query.isOnline) {
            query = query.find({ isOnline: true });
        }
        if (req.query.sort) {
            let sortIn = req.query.sort.split(",").join(" ");
            console.log(sortIn);
            query = query.find().sort(sortIn);
        }

        users = await query.select("-password");
        if (!users) {
            return res.status(404).json({ message: "No users Found" });
        }
        return res.status(200).json({ message: "Users Details", results: users.length, data: users });
    } catch (err) {
        next(err);
    }
}

exports.likeAPost = async(req, res, next) => {
    try {
        const pid = req.params.pid;
        const checkExistLike = await Like.findOne({ userId: req.userId, postId: pid });
        if (!checkExistLike) {
            const like = Like({
                userId: req.userId,
                postId: pid
            });
            const likeSave = await like.save();
        } else {
            const deleteLike = await Like.deleteOne({ userId: req.userId, postId: pid });
        }
        res.status(201).json({
            status: "success",
            message: "liked post",
            data: null
        });
    } catch (err) {
        next(err)
    }
}


const clearImage = filePath => {
    try {
        const defaultImg = filePath.split("/")[2];
        if (defaultImg == "avatar.jpeg") {
            return 0;
        }
        imgPath = path.join(__dirname, "../", filePath);
        fs.unlink(imgPath, err => {
            if (err) {
                return res.status(422).json({ message: "Failed to delete Image" });
            }
        });
    } catch (err) {
        next(err);
    }
}

const IOfunction = (array, action, data) => {
    io.getIO().emit(array, {
        action: action,
        data: data
    });
}

module.exports.IOfunction = IOfunction