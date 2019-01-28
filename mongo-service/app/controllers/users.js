const { pick } = require("lodash");

const debug = require("debug")(process.env["DEBUG"]);

const {
    Answer,
    Question,
    User,
    Team
} = require("../models");

const user = {
    getUser: async function (req, res, id) {
        const token = req.headers["x-auth"];
        User
            .findOne({
                token
            })
            .then((user) => {
                cb.getUserSuccess(res, user, id);
            })
            .catch((err) => {
                debug(err);
            });
    },
    getUsers: async function (req, res) {
        const token = req.headers["x-auth"];
        User
            .findOne({
                token
            })
            .then((user) => {
                cb.getUsersSuccess(res, user);
            })
            .catch((err) => {
                debug(err);
            });
    },
    getUsersData: async function (req, res, id) {
        const token = req.headers["x-auth"];
        User
            .findOne({
                token
            })
            .then((user) => {
                cb.getUsersDataSuccess(req, res, user, id);
            })
            .catch((err) => {
                debug(err);
            });
    },
    patchUser: async function (req, res, id) {
        const token = req.headers["x-auth"];
        User
            .findOne({
                token
            })
            .then((user) => {
                cb.patchUserSuccess(req, res, user, id);
            })
            .catch((err) => {
                debug(err);
            });
    }
}

const cb = {
    getUserSuccess: async function (res, user, id) {
        if (user) {
            user.isAdmin
            ? User
                .findById(id || user.id)
                .then((usr) => {
                    if (!usr) {
                        res.status(400).send();
                    } else {
                        Answer
                            .find({
                                u_id: id || user.id
                            })
                            .sort({
                                "atTime": -1
                            })
                            .populate("q_id")
                            .then(answers => {
                                res.send(answers)
                            })
                    }
                }) :
                res
                .status(403)
                .send("UnAuthorized");
        } else {
            res
                .status(401)
                .send();
        }
    },
    "getUsersSuccess": async function (res, user) {
        if (user) {
            user.isAdmin === true ?
                User
                .find({}).populate("team")
                .then((users) => {
                    res.send({
                        users
                    })
                }) :
                res
                .status(403)
                .send("UnAuthorized");
        } else {
            res
                .status(401)
                .send();
        }
    },
    getUsersDataSuccess: async (req, res, user, id) => {
        if (user) {
            user.isAdmin === true ?
                User
                .findById(id || user.id)
                .then((usr) => {
                    if (!usr) {
                        res
                            .status(404)
                            .send();
                    } else {
                        let total = correct = inCorrect = notAnswered = 0;
                        Question
                            .count({
                                team: usr.team
                            }) // convert to array
                            .then((count, err) => {
                                total = count;
                                Answer
                                    .count({
                                        u_id: req.params.id,
                                        correct: true
                                    })
                                    .then((count, err) => {
                                        correct = count
                                        Answer
                                            .count({
                                                u_id: req.params.id,
                                                correct: false
                                            })
                                            .then((count, err) => {
                                                inCorrect = count
                                                notAnswered = total - (correct + inCorrect);
                                                res.send({
                                                    "correct": correct,
                                                    "inCorrect": inCorrect,
                                                    "notAnswered": notAnswered
                                                })
                                            })
                                    })
                            });
                    }
                }) :
                res
                .status(403)
                .send("UnAuthorized");
        } else {
            res
                .status(401)
                .send();
        }
    },
    patchUserSuccess: async (req, res, user, id) => {
        if (user) {
            user.isAdmin === true ?
                User
                .findById(id || user.id)
                .then((usr) => {
                    if (!usr) {
                        res
                            .status(404)
                            .send()
                    } else {
                        let action = req.body.action;
                        switch (action) {
                            case "admin":
                                usr.isAdmin = req.body.isAdmin;
                                usr
                                    .save()
                                    .then((user) => {
                                        res.send("Success")
                                    })
                                    .catch(e => debug(e));
                                break;
                            case "addTeam":
                                Team.findById(req.body.team).then((tm) => {
                                    usr.team.push(tm);
                                    usr
                                        .save()
                                        .then((user) => {
                                            res.send("Success")
                                        })
                                        .catch(e => debug(e));
                                })
                                break;
                            case "removeTeam":
                                usr.team.pull(req.body.team);
                                usr
                                    .save()
                                    .then((user) => {
                                        res.send("Success")
                                    })
                                    .catch(e => debug(e));
                                break;
                        }
                    }
                }) :
                res
                .status(403)
                .send("UnAuthorized");
        } else {
            res
                .status(401)
                .send();
        }
    }
}

module.exports = {
    user
}