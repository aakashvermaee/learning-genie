const port = process.env.PORT || 2019;

// app-config
require("./config/config");

const fastify = require("fastify")({
    logger: process.env["DEBUG"] || false
});

const {
    json,
    urlencoded
} = require("body-parser");

fastify.use(json());
fastify.use(urlencoded({
    extended: false
}));

fastify.use(async (req, res, next) => {
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, X-Auth");
    res.setHeader("Access-Control-Allow-Credentials", true);
    res.setHeader("Access-Control-Allow-Methods", "OPTIONS, GET, POST, PUT, DELETE, PATCH, HEAD");
    
    const env = (process.env["NODE_ENV"] ? process.env["NODE_ENV"] : "development").toLowerCase();
    env === "production"
    ? res.setHeader("Access-Control-Allow-Origin", "http://app-learning-genie777.herokuapp.com")
    : res.setHeader("Access-Control-Allow-Origin", req.headers.host);
    
    next();
});

fastify.get('/', async (req, res) => {
    res.header("content-type", "text/html");
    res.send(`<h2>Greetings from Mongo DB Service. Request Time: "${new Date().toLocaleString()}"</h2>`);
});

// api-routes
require("./app/routes").api.apiRoutes.forEach((route, index) => {
    route.forEach((route) => {
        fastify.route(route);
    });
});

// bind
fastify.listen(port, async (err) => {
    if (err) throw err;
    fastify.log.info(`server listening on ${port}`);
});
