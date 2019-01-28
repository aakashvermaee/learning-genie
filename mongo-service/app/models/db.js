const debug = require("debug")(process.env.DEBUG);
const mongoose = require("mongoose");

mongoose.promise = require("bluebird");

mongoose
    .connect(process.env.MONGODB_URI, {
        useNewUrlParser: true
    })
    .then((resolve) => {
        debug("Connected to Mongo...");
    }).catch((e) => {
        debug(e);
    });

module.exports.mongoose = mongoose;