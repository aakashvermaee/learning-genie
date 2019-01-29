const { userApiRoutes } = require("../../config/mongo-service-uris");
const axios = require("axios");

const user = {
    getUser: function (req, res, id) {
        const token = req.headers['x-auth'];
        axios
            .get(userApiRoutes.getUser, {
                "headers": {
                    "x-auth": token
                },
                "params": {
                    id
                }
            })
            .then((resolve) => res.send(resolve.data))
            .catch((reject) => res.send(reject.data));
    },
    getUsers: function (req, res) {
        const token = req.headers['x-auth'];
        axios
            .get(userApiRoutes.getUsers, {
                "headers": {
                    "x-auth": token
                }
            })
            .then((resolve) => res.send(resolve.data))
            .catch((reject) => res.send(reject.data));
    },
    getUsersData: function (req, res, id) {
        const token = req.headers['x-auth'];
        axios
            .get(userApiRoutes.getUsersDataById, {
                "headers": {
                    "x-auth": token
                },
                "params": {
                    id
                }
            })
            .then((resolve) => res.send(resolve.data))
            .catch((reject) => res.send(reject.data));
    },
    // TODO
    patchUser: function (req, res, id) {
        const token = req.headers['x-auth'];
        /* axios
        .patch(userApiRoutes.patchUserById, {
            "headers": {
                "x-auth": token
            },
            "data": {
                team: req.body.team,
                action: req.body.action,
                isAdmin: req.body.isAdmin
            }
        }) */
    }
}

module.exports = {
    user
}
