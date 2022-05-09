const mongoose = require("mongoose")

const Schema = mongoose.Schema;


const deleteMessageSchema = new Schema({
    senderid: {
        type: mongoose.Types.ObjectId,
        ref: "user",
        required: [true, "require field need to sender Id"]
    },
    lastMessageDate: {
        type: Date,
        default: new Date().getTime(),
        required: [true, "require field last Message Date"]
    },
    receiverid: {
        type: mongoose.Types.ObjectId,
        ref: "user",
        required: [true, "require field need to receiver Id"]
    }
}, { timestamps: true });


module.exports = mongoose.model("deleteMessage", deleteMessageSchema);