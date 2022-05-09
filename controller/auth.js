const bcrypt = require("bcryptjs");

const User = require("../models/users");

const IOfunction = require("../controller/api").IOfunction;

exports.signup = async(req, res, next) => {
    try {
        const email = req.body.email;
        const name = req.body.name;
        const password = req.body.password;
        const user = new User({
            email: email,
            password: password,
            name: name
        })
        const result = await user.save();
        res.status(200).json({
            message: "succsessfully created",
            user: result,
            status: "success"
        });
    } catch (err) {
        next(err);
    }
}

exports.login = async(req, res, next) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        let loadUser;
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(404).json({ message: "not authenticated" })
        }
        const isEqual = await bcrypt.compare(password, user.password);
        if (!isEqual) {
            return res.status(401).json({ message: "not authenticated : invalid username or passoword" });
        }
        user.isOnline = true;
        const updatedUser = await user.save();
        // req.session.isOnline = true;
        // await req.session.save();

        const token = await updatedUser.generateToken();

        const allUser = await User.find().select("-password");
        IOfunction("isOnline", "check", allUser)
            // io.getIO().emit('isOnline', {
            //     action: 'check',
            //     user: allUser
            // });
        res.status(200).json({ token: token, data: updatedUser, status: "success" });

    } catch (err) {
        next(err);
    }
}

exports.logout = async(req, res, next) => {
    try {
        const existUser = await User.findById(req.userId);
        if (!existUser) {
            const error = new Error("User Not Found");
            error.statusCode = 404;
            throw error;
        }
        existUser.isOnline = false;
        await existUser.save();

        // req.session.isOnline = false;
        // await req.session.save();
        const allUser = await User.find().select("-password");
        IOfunction("isOnline", "check", allUser);
        // io.getIO().emit('isOnline', {
        //     action: 'check',
        //     user: allUser
        // });

        res.status(200).json({
            message: "User Logged Out"
        });
    } catch (err) {
        next(err)
    }
}