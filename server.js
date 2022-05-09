const app = require("./app");

const server = require('http').Server(app);

const io = require("./socket").init(server);

const Message = require("./models/message");

const res = require("express/lib/response");

const { default: mongoose } = require("mongoose");

const User = require("./models/users");

require("./config/db");

const IOfunction = require("./controller/api").IOfunction;

// in threre change disconnect isOnline false at when user disconnect

io.on("connection", socket => {
    console.log("Client Connected");
    // console.log(socket.id);

    socket.on("isOnline", (userId) => {
        console.log("Online");
        // const allUser = await User.find({ isOnline: true }).select("-password");
        // IOfunction("isOnline", "check", allUser);
        // IOfunction()
        socket.userId = userId;
        // const isOnline = { id: socket.id, userId };
        console.log(socket.userId);
    });

    socket.on('joinChat', (room) => {
        socket.join(room);
        socket.room = room;
        console.log("joinChat");
        console.log(room);
        // let users = room.split("_");
        // const msgs = await Message.find({
        //     users: {
        //         $all: users,
        //     },
        // }).sort({ updatedAt: 1 });
        // if (msgs) {
        //     console.log(msgs);
        //     socket.to(room).emit("oldMessage", msgs);
        // }
    });

    socket.on("sendMessage", async(msg) => {
        console.log(msg);
        console.log("sendMessage");
        console.log(msg.room);
        const msgSave = await Message.create({
            _id: new mongoose.Types.ObjectId(msg.messageId),
            message: msg.message,
            users: [msg.senderid, msg.receiverid],
            senderid: msg.senderid
        });
        if (msgSave) {
            socket.to(msg.room).emit("receiveMessage", msg);
        }
    });

    socket.on('leaveChat', () => {
        console.log("leave Chat");
        console.log(socket.room);
        socket.leave(socket.room);
    });

    socket.on('disconnect', async() => {
        console.log("disconnected");
        console.log(socket.userId);
        await User.updateOne({ _id: socket.userId }, {
            $set: {
                isOnline: false
            }
        });
        const allUser = await User.find().select("-password");
        IOfunction("isOnline", "check", allUser);
    });
});

server.listen(process.env.PORT, () => {
    console.log("Server response ready to use " + process.env.PORT);
});