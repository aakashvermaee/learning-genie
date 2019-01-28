const { Answer, Question, User, Team } = require('../models');

const team = {
    getTeams: function (req, res) {
        const token = req.headers['x-auth'];
        User
            .findOne({ token })
            .then((user) => {
                cb.getTeamsSuccess(res, user);
            })
            .catch((err) => {
                process.logger(undefined, err);
            });
    },
    createTeam: function (req, res) {
        const token = req.headers['x-auth'];
        User
            .findOne({ token })
            .then((user) => {
                cb.createTeamSuccess(req, res, user);
            })
            .catch((err) => {
                process.logger(undefined, err);
            });
    },
    renameTeam: function (req, res, id) {
        const token = req.headers['x-auth'];
        User
            .findOne({ token })
            .then((user) => {
                cb.renameTeamSuccess(req, res, user, id);
            })
            .catch((err) => {
                process.logger(undefined, err);
            });
    }
}

const cb = {
    getTeamsSuccess: function (res, user) {
        if (user) {
            user.isAdmin === true
                ? Team
                    .find({})
                    .then((teams) => {
                        res.send({ teams })
                    }).catch((e) => { console.log(e) })
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
    createTeamSuccess: function (req, res, user) {
        if (user) {
            if (user.isAdmin === true) {
                let team = new Team({ 'teamName': req.body.teamName });
                team
                    .save()
                    .then((tm) => {
                        if (!tm) {
                            res
                                .status(404)
                                .send();
                            res.end();
                        } else {
                            res.send({ message: 'Team created' });
                        }
                    })
                    .catch((e) => { console.log(e) })
            }
            else {
                res
                    .status(403)
                    .send("UnAuthorized");
            }
        } else {
            res
                .status(401)
                .send();
            // process.logger(undefined, 'user not found');
        }
    },
    renameTeamSuccess: async function (req, res, user, id) {
        if (user) {
            if (user.isAdmin === true) {
                let team = await Team.findById(id);
                team.teamName = req.body.teamName;
                team
                    .save()
                    .then((tm) => {
                        if (!tm) {
                            res
                                .status(404)
                                .send();
                            res.end();
                        } else {
                            res.send({ message: 'Team renamed' });
                        }
                    })
                    .catch((e) => { console.log(e) })
            }
            else {
                res
                    .status(403)
                    .send("UnAuthorized");
            }
        } else {
            res
                .status(401)
                .send();
            // process.logger(undefined, 'user not found');
        }
    }
}

module.exports = {
    team
}
