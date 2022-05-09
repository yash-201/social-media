const mongoose = require("mongoose")

const validator = require("validator");

const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");

const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {
        type: String,
        required: [true, "require field email"],
        minlength: [3, "a email min or equal than 3 character"],
        maxlength: [30, "a email max or equal than 30 character"],
        unique: true,
        validate(value) {
            // if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value)) {
            //     throw new Error("not valid Email");
            // }
            if (!validator.isEmail(value)) {
                throw new Error("not valid Email");
            }
        }
    },
    password: {
        type: String,
        required: [true, "require field password"]
    },
    name: {
        type: String,
        required: [true, "require field name"],
        maxlength: [20, "a name max or equal than 20 character"],
        minlength: [3, "a name min or equal than 3 character"]

    },
    image: {
        type: String,
        default: "/images/avatar.jpeg",
        required: [true, "require field image avatar"]
    },
    isOnline: {
        type: Boolean,
        default: false,
        required: true
    },
    isAdmin: {
        type: Boolean
    }
}, { timestamps: true });

userSchema.methods.generateToken = async function() {
    return await jwt.sign({
            email: this.email,
            userId: this._id.toString()
        },
        process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES
        });
};

userSchema.pre("save", async function(next) {
    if (this.isModified("password")) {
        console.log(`current password ${this.password}`);
        this.password = await bcrypt.hash(this.password, 12);
        console.log(`current password ${this.password}`);
    }
    next();
});

module.exports = mongoose.model("user", userSchema);