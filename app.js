const dotenv = require("dotenv")

dotenv.config({ path: "./.env" });

const express = require("express")

const fs = require("fs");

const app = express();

const path = require("path");

const apiRouter = require("./routers/api");

const msgRouter = require("./routers/message");

const bodyParser = require("body-parser");

const session = require("express-session");

const { default: mongoose } = require("mongoose");

// const helmet = require("helmet");

const mongoDbStore = require("connect-mongodb-session")(session);

const cors = require('cors');

// const cookieParser = require('cookie-parser');

const store = mongoDbStore({
    uri: process.env.DATABASE_CONNECTION_STRING,
    collection: "sessions"
});

const multer = require("multer");
const { Socket } = require("socket.io");
const compression = require("compression");
const morgan = require("morgan");

const accessLogStream = fs.createWriteStream(path.join(__dirname, "access.log"), { flags: "a" });

app.use(cors()); // cross platform run independence

// app.use(helmet()); // that send various http headers to help protect app

app.use(compression()) // compress file size in request

app.use(morgan("tiny", { stream: accessLogStream })); // logged request

// app.use(morgan("combined", { stream: accessLogStream })); // logged request

app.use("/images", express.static(path.join(__dirname, '/images')));

app.use("/images/post", express.static(path.join(__dirname, '/images/post')));

// app.use(bodyParser.urlencoded({ extended: true })); //this for  x-www-form-urlencode <form>

app.use(bodyParser.json()); // this for json   applcation/json

// app.use(express.cookieParser());

// app.use((req, res, next) => {
//     res.setHeader("Access-Control-Allow-Origin", "*");
//     res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE");
//     res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");
//     next();
// });

// app.use(cookieParser());

// app.use(session({
//     secret: 'my secret',
//     resave: false,
//     saveUninitialized: false,
//     store: store,
//     cookie: {
//         // Session expires after 1 min of inactivity.
//         expires: 20000,
//         sameSite: true
//     }
// }));

// app.use((req, res, next) => {
//     if (req.session.isOnline == true) {
//         req.session.cookie.expires = new Date(Date.now() + 20000);
//     } else {
//         req.session.isOnline = false;
//     }
//     next();
// });

app.use("/api", apiRouter);

app.use((error, req, res, next) => {
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;
    res.status(status).json({ message: message });
});

module.exports = app;