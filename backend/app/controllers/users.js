const {pick} = require('lodash');

const { Answer, Question, User, Team } = require('../models');

const mongoUserApi = require("../../config/mongo-service-uris").user;
const axios = require("axios");

const user = {
    getUser: function (req, res, id) {
        const token = req.headers['x-auth'];
        User
            .findOne({token})
            .then((user) => {
                cb.getUserSuccess(res, user, id);
            })
            .catch((err) => {
                process.logger(undefined, err);
            });
        // User.findUser(token).then((user) => process.logger(user));
    },
    getUsers: function (req, res) {
        const token = req.headers['x-auth'];
        axios
        .get(mongoUserApi.getUsers, {
            headers: {
                "x-auth": token
            }
        })
        .then((resolve) => console.log(resolve))
        .catch((e) => console.log(e));
    },
    getUsersData: function (req, res, id) {
        const token = req.headers['x-auth'];
        User
            .findOne({ token })
            .then((user) => {
                cb.getUsersDataSuccess(req, res, user, id);
            })
            .catch((err) => {
                process.logger(undefined, err);
            });
    },
    patchUser:  function (req, res, id) {
        const token = req.headers['x-auth'];
        User
            .findOne({ token })
            .then((user) => {
                cb.patchUserSuccess(req, res, user, id);
            })
            .catch((err) => {
                process.logger(undefined, err);
            });
    }
}

const cb = {
    getUserSuccess: function (res, user, id) {
        if (user) {
            user.isAdmin === true
                ? User
                    .findById(id)
                    .then((usr) => {
                        if (!usr) {
                            res
                                .status(400)
                                .send()
                        } else {
                            Answer
                                .find({ u_id: id })
                                .sort({ 'atTime': -1 })
                                .populate('q_id')
                                .then(answers => {
                                    res.send(answers)
                                })
                        }
                    })
                : res
                    .status(403)
                    .send("UnAuthorized");
        } else {
            res
                .status(401)
                .send();
            // process.logger(undefined, 'user not found');
        }
    },
    "getUsersSuccess": function (res, user) {
        if (user) {
            user.isAdmin === true
                ? User
                    .find({}).populate("team")
                    .then((users) => {
                        res.send({ users })
                    })
                : res
                    .status(403)
                    .send("UnAuthorized");
        } else {
            res
                .status(401)
                .send();
            // process.logger(undefined, 'user not found');
        }
    },
    getUsersDataSuccess: (req, res, user, id) => {
        if (user) {
            user.isAdmin === true
                ? User
                    .findById(id)
                    .then((usr) => {
                        if (!usr) {
                            res
                                .status(404)
                                .send();
                        } else {
                            let total = correct = inCorrect = notAnswered = 0;
                            Question
                                .count({ team: usr.team }) // convert to array
                                .then((count, err) => {
                                    total = count;
                                    Answer
                                        .count({ u_id: req.params.id, correct: true })
                                        .then((count, err) => {
                                            correct = count
                                            Answer
                                                .count({ u_id: req.params.id, correct: false })
                                                .then((count, err) => {
                                                    inCorrect = count
                                                    notAnswered = total - (correct + inCorrect);
                                                    res.send({ 'correct': correct, 'inCorrect': inCorrect, 'notAnswered': notAnswered })
                                                })
                                        })
                                });
                        }
                    })
                : res
                    .status(403)
                    .send("UnAuthorized");
        } else {
            res
                .status(401)
                .send();
            // process.logger(undefined, 'user not found');
        }
    },
    patchUserSuccess: (req, res, user, id) => {
        if (user) {
            user.isAdmin === true
                ? User
                    .findById(id)
                    .then((usr) => {
                        if (!usr) {
                            res
                                .status(404)
                                .send()
                        } else {
                            let action = req.body.action;
                            switch (action)
                            {
                                case 'admin':
                                    usr.isAdmin = req.body.isAdmin;
                                    usr
                                    .save()
                                    .then((user) => { 
                                        res.send("Success")
                                    })
                                    .catch(e => process.logger(e));
                                    break;
                                case 'addTeam':
                                    Team.findById(req.body.team).then((tm)=>{
                                        usr.team.push(tm);
                                        usr
                                        .save()
                                        .then((user) => { 
                                            res.send("Success")
                                        })
                                        .catch(e => process.logger(e));
                                    })
                                    break;
                                case 'removeTeam':
                                    usr.team.pull(req.body.team);
                                    usr
                                    .save()
                                    .then((user) => { 
                                        res.send("Success")
                                    })
                                    .catch(e => process.logger(e));
                                    break;
                            }
                        }
                    })
                : res
                    .status(403)
                    .send("UnAuthorized");
        } else {
            res
                .status(401)
                .send();
            // process.logger(undefined, 'user not found');
        }
    }
}

module.exports = {
    user
}
