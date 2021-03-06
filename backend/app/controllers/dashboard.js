const {Answer, Question, User, Team} = require('../models');

const dashboard = {
    getDashData: function (req, res) {
        let token = req.headers['x-auth'];
        User
            .findOne({token})
            .then((user) => {
                cb.getDashDataSuccess(res, user);
            })
            .catch((err) => {
                process.logger(undefined, err);
            })
    }
};

const cb = {
    getDashDataSuccess: function (res, user) {
        if (user) {
            if (user.isAdmin) {
                let total = correct = inCorrect = notAnswered = 0;
                Question
                    .count()
                    .then((count, err) => {
                        total = count
                        User
                            .count()
                            .then((count, err) => {
                                total *= count
                                Answer
                                    .count({correct: true})
                                    .then((count, err) => {
                                        correct = count
                                        Answer
                                            .count({correct: false})
                                            .then((count, err) => {
                                                inCorrect = count
                                                notAnswered = total - (correct + inCorrect);
                                                res.send({'correct': correct, 'inCorrect': inCorrect, 'notAnswered': notAnswered})
                                            })
                                    })
                            })
                    });
            } else {
                res
                    .status(403)
                    .send(UnAuthorized);
            }
        } else {
            res
                .status(401)
                .send();
            // process.logger("user not found");
        }
    }
}

module.exports = {
    dashboard
}
