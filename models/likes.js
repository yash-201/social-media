const mongoose = require("mongoose")

const Schema = mongoose.Schema;


const likeSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "user",
        required: [true, "require field need to userId"]
    },
    postId: {
        type: Schema.Types.ObjectId,
        ref: "post",
        required: [true, "require field need to postId"]
    }
}, { timestamps: true });


module.exports = mongoose.model("like", likeSchema);