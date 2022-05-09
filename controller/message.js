const Message = require("../models/message");

const DeleteMessage = require("../models/deleteMessage");

const { default: mongoose } = require("mongoose");

module.exports.addMessage = async(req, res, next) => {
    try {
        console.log("demo");
        // console.log(req.body);

        const { senderid, receiverid, message, messageId } = req.body;
        const demo = new mongoose.Types.ObjectId(messageId);
        const data = await Message.create({
            // _id: messageId,
            _id: new mongoose.Types.ObjectId(messageId),
            message: { text: message },
            users: [senderid, receiverid],
            sender: senderid
        });

        if (data) {
            return res.status(202).json({
                message: "Send Messsage",
                status: "success"
            })
        }
        return res.status(404).json({
            message: "message not send",
            status: "fail"
        })
    } catch (err) {
        next(err);
    }
}

module.exports.getAllMessage = async(req, res, next) => {
    try {
        const { senderid, receiverid } = req.body;
        let messages = null;
        let delMessage = await DeleteMessage.findOne({
            senderid: senderid,
            receiverid: receiverid
        });
        if (delMessage) {
            messages = await Message.find({
                users: {
                    $all: [senderid, receiverid],
                },
                createdAt: {
                    $gt: delMessage.lastMessageDate
                }
            }).sort({ createdAt: 1 });
            // console.log("if");
        } else {
            messages = await Message.find({
                users: {
                    $all: [senderid, receiverid],
                }
            }).sort({ createdAt: 1 });
            // console.log("else");
        }
        const projectedMessages = messages.map((msg) => {
            return {
                fromSelf: msg.senderid.toString() === senderid,
                messageId: msg._id,
                message: msg.message,
                time: msg.createdAt
            };
        });
        res.status(200).json(projectedMessages);
    } catch (ex) {
        next(ex);
    }
}

exports.deleteChat = async(req, res, next) => {
    try {
        const { senderid, receiverid } = req.body;
        console.log(req.body);
        const existLastMessage = await DeleteMessage.findOne({
            senderid: senderid,
            receiverid: receiverid
        });
        if (existLastMessage) {
            existLastMessage.lastMessageDate = new Date().getTime();
            await existLastMessage.save();
        } else {
            await DeleteMessage.create({
                senderid: senderid,
                receiverid: receiverid
            });
        }
        return res.status(200).json({
            status: "success",
            message: "delete Chat successfully"
        });

    } catch (err) {
        next(err);
    }

}


exports.deleteSingleMessage = async(req, res, next) => {
    try {
        const cid = req.params.cid;
        console.log(cid);
        const existChat = await Message.findOne({
            _id: cid,
            senderid: req.userId
        })
        if (!existChat) {
            return res.status(403).json({
                status: "fail",
                message: "authentication issue"
            })
        }
        const delMessage = await Message.findByIdAndUpdate(cid, {
            message: "This Message was Deleted."
        });
        if (delMessage) {
            res.status(200).json({
                status: "success",
                message: "Chat Deleted"
            });
        }
    } catch (err) {
        next(err)
    }
}