const {pick} = require('lodash');

const {Answer, Question, User, Team} = require('../models');

const answer = {
    postAnswer: (req, res, io, token) => {
        User
            .findOne({token})
            .then((user) => {
                cb.postAnswerSuccess(req, res, io, user);
            })
            .catch((err) => {
                process.logger(undefined, err);
            });
    }
}

const cb = {
    postAnswerSuccess: (req, res, io, user) => {
        if (user) {
            let body = pick(req.body, ['q_id', 'ans']);
            body.u_id = user._id
            body.atTime = new Date().getTime()
            let answer = new Answer(body)
            Question
                .checkAns(body)
                .then((resp) => {
                    answer.correct = resp
                    answer
                        .save()
                        .then((ans) => {
                            if (ans) {
                                res.send("response submitted");
                                res.end();
                                io
                                    .to(req.body.clientId)
                                    .emit("submitted")
                            } else {
                                res
                                    .status(404)
                                    .send("error");
                                res.end();
                            }
                        })
                })

        } else {
            res
                .status(401)
                .send();
            // process.logger("user not found");
        }
    }
}

module.exports = {
    answer
}
