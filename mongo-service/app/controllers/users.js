const { pick } = require("lodash");

const debug = require("debug")(process.env["DEBUG"]);

const { Answer, Question, User, Team } = require("../models");

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
            .catch((e) => res.send({ "err": e }));
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
            .catch((e) => res.send({ "err": e }));
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
            .catch((e) => res.send({ "err": e }));
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
            .catch((e) => res.send({ "err": e }));
    }
}

const cb = {
    getUserSuccess: async function (res, user, id) {
        if (user && user.isAdmin) {
            User
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
                            .catch((e) => res.send({ "err": e }));
                    }
                })
                .catch((e) => res.send({ "err": e }));
        } else {
            res.send({ status: 401, statusText: "UnAuthorized", reason: "User is not an admin!" });
        }
    },
    "getUsersSuccess": async function (res, user) {
        if (user && user.isAdmin) {
            User
                .find({}).populate("team")
                .then((users) => {
                    res.send({
                        users
                    })
                })
                .catch((e) => res.send({ "err": e }));
        } else {
            res.send({ status: 401, statusText: "UnAuthorized", reason: "User is not an admin!" });
        }
    },
    getUsersDataSuccess: async (req, res, user, id) => {
        const _id = id || user.id;
        if (user && user.isAdmin) {
            User
                .findById(_id)
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
                                        u_id: _id,
                                        correct: true
                                    })
                                    .then((count, err) => {
                                        correct = count
                                        Answer
                                            .count({
                                                u_id: _id,
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
                                            .catch((e) => res.send({ "err": e }));
                                    })
                                    .catch((e) => res.send({ "err": e }));
                            });
                    }
                });
        } else {
            res.send({ status: 401, statusText: "UnAuthorized", reason: "User is not an admin!" });
        }
    },
    patchUserSuccess: async (req, res, user, id) => {
        const _id = id || user.id;
        if (user && user.isAdmin) {
            User
                .findById(_id)
                .then((usr) => {
                    if (!usr) {
                        res.status(404).send()
                    } else {
                        let action = req.body.action;
                        switch (action) {
                            case "admin":
                                usr.isAdmin = req.body.isAdmin;
                                usr
                                    .save()
                                    .then((user) => {
                                        res.send({ status: 200, statusText: "Success", "msg": "User Updated!" });
                                    })
                                    .catch((e) => res.send({ "err": e }));
                                break;
                            case "addTeam":
                                Team.findById(req.body.team).then((tm) => {
                                    usr.team.push(tm);
                                    usr
                                        .save()
                                        .then((user) => {
                                            res.send({ status: 200, statusText: "Success", "msg": "Team Added!" });
                                        })
                                        .catch((e) => res.send({ "err": e }));
                                })
                                break;
                            case "removeTeam":
                                usr.team.pull(req.body.team);
                                usr
                                    .save()
                                    .then((user) => {
                                        res.send({ status: 200, statusText: "Success", "msg": "Team Removed!" });
                                    })
                                    .catch((e) => res.send({ "err": e }));
                                break;
                        }
                    }
                })
                .catch((e) => debug(e));
        } else {
            res.send({ status: 401, statusText: "UnAuthorized", reason: "User is not an admin!" });
        }
    }
}

module.exports = {
    user
}