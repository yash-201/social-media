const mongoose = require("mongoose")

const Schema = mongoose.Schema;


const messageSchema = new Schema({
    _id: {
        type: mongoose.Schema.ObjectId,
    },
    message: {
        type: String,
        required: true
    },
    users: Array,
    senderid: {
        type: mongoose.Types.ObjectId,
        ref: "user",
        required: true
    }
}, { _id: false, timestamps: true });

module.exports = mongoose.model("message", messageSchema);