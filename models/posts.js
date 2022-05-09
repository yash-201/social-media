const mongoose = require("mongoose");

const { post } = require("../app");

const slugify = require("slugify");

const Schema = mongoose.Schema;

const postSchema = new Schema({
    image: {
        type: String,
        required: [true, "require field image URL"]
    },
    caption: {
        type: String,
        required: [true, "require field image Caption"]
    },
    creator: {
        type: Schema.Types.ObjectId,
        ref: "user",
        required: [true, "require field image creator"]
    },
    date: {
        type: Date,
        default: new Date().getTime()
    }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true
});

postSchema.pre("save", function(next) {
    this.caption = slugify(this.caption, {
        trim: true,
        replacement: ' '
    });
    console.log(this);
    next();
});

// postSchema.post("save", function(doc, next) {
//     console.log(this);
// });

postSchema.virtual("postTime").get(function() {
    let seconds = Math.floor((new Date().getTime() - this.date) / 1000);

    let interval = seconds / 31536000;

    if (interval > 1) {
        return Math.floor(interval) + " years ago";
    }
    interval = seconds / 2592000;
    if (interval > 1) {
        return Math.floor(interval) + " months ago";
    }
    interval = seconds / 86400;
    if (interval > 1) {
        return Math.floor(interval) + " days ago";
    }
    interval = seconds / 3600;
    if (interval > 1) {
        return Math.floor(interval) + " hours ago";
    }
    interval = seconds / 60;
    if (interval > 1) {
        return Math.floor(interval) + " minutes ago";
    }
    return Math.floor(seconds) + " seconds ago";
})

module.exports = mongoose.model("post", postSchema);