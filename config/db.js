const mongoose = require("mongoose");

mongoose.connect(process.env.DATABASE_CONNECTION_STRING)
    .then(result => {
        console.log("Connect with mongoDb");

    }).catch(err => console.log(err));