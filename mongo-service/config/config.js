const env = process.env.NODE_ENV || "development";

const debug = require("debug")(process.env["DEBUG"]);

env === "development" ? require("../env/dev") : require("../env/prod");

debug({
    env
});