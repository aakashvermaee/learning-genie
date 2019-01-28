const {pick} = require('lodash');

const {Answer, Question, User, Team} = require('../models');

const question = {
    getQuestions: function (req, res) {
        const token = req.headers['x-auth'];
        User
            .findOne({token})
            .then((user) => {
                cb.getQuestionsSuccess(res, user);
            })
            .catch((err) => {
                process.logger(undefined, err);
            });
    },
    getQuestionsId: function (req, res, id) {
        const token = req.headers['x-auth'];
        User
            .findOne({token})
            .then((user) => {
                cb.getQuestionsIdSuccess(res, user, id);
            })
            .catch((err) => {
                process.logger(undefined, err);
            });
    },
    getQuestionsDataId: function (req, res, id) {
        const token = req.headers['x-auth'];
        User
            .findOne({token})
            .then((user) => {
                cb.getQuestionsDataIdSuccess(res, user, id);
            })
            .catch((err) => {
                process.logger(undefined, err);
            });
    },
    postQuestion: function (req, res, io) {
        const token = req.headers['x-auth'];
        User
            .findOne({token})
            .then((user) => {
                cb.postQuestionSuccess(req, res, user, io);
            })
            .catch((err) => {
                process.logger(undefined, err);
            });
    }
}

const cb = {
    getQuestionsSuccess: (res, user) => {
        if (user) {
            user.isAdmin === true
                ? Question
                    .find({})
                    .sort({'atTime': -1})
                    .populate('team','teamName')
                    .then((questions) => {
                        if (!questions) {
                            res
                                .status(400)
                                .send();
                        } else {
                            res.send({questions});
                        }
                    })
                : res
                    .status(403)
                    .send("UnAuthorized");
        } else {
            res
                .status(401)
                .send();
        }
    },
    getQuestionsIdSuccess: function (res, user, id) {
        if (user) {
            user.isAdmin === true
                ? Question
                    .findById(id)
                    .then((question) => {
                        if (!question) {
                            res
                                .status(400)
                                .send();
                        } else {
                            Answer
                                .find({q_id: id})
                                .sort({
                                    'atTime': + 1
                                })
                                .populate('u_id', 'email')
                                .then(answers => {
                                    res.send(answers);
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
            // process.logger("user not found")
        }
    },
    getQuestionsDataIdSuccess: (res, user, id) => {
        if (user) {
            user.isAdmin === true
                ? Question
                    .findById(id)
                    .then((question) => {
                        if (!question) {
                            res
                                .status(400)
                                .send();
                        } else {
                            let total = correct = inCorrect = notAnswered = 0;
                            User
                                .count({team: question.team})
                                .then((count, err) => {
                                    total = count;
                                    Answer
                                        .count({q_id: id, correct: true})
                                        .then((count, err) => {
                                            correct = count;
                                            Answer
                                                .count({q_id: id, correct: false})
                                                .then((count, err) => {
                                                    inCorrect = count
                                                    notAnswered = total - (correct + inCorrect);
                                                    res.send({'correct': correct, 'inCorrect': inCorrect, 'notAnswered': notAnswered})
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
            // process.logger("user not found")
        }
    },
    postQuestionSuccess: (req, res, user, io) => {
        if (user) {
            if (user.isAdmin) {
                let body = pick(req.body, ['ques', 'keys', 'team']);
                body.atTime = new Date().getTime();
                let question = new Question(body)
                question
                    .save()
                    .then((question) => {
                        if (!question) {
                            res
                                .status(404)
                                .send();
                            res.end();
                        } else {
                            res.send({message: 'Question Posted'});
                            process.logger('question emitted');
                            Team.findById(req.body.team).then((team)=>{
                                io
                                .to(team.teamName)
                                .emit('newQuestion', question);
                            });
                            
                        }
                    })
            } else {
                res
                    .status(403)
                    .send();
            }
        } else {
            res
                .status(401)
                .send();
        }
    }
}

module.exports = {
    question
}
