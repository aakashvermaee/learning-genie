const { user, team, answer, question } = require("../controllers");

const answerApiRoutes = [{
    "method": "POST",
    "url": "/api/answer",
    "handler": answer.postAnswer
}];

const userApiRoutes = [{
        "method": "GET",
        "url": "/api/user",
        "handler": user.getUser
    },
    {
        "method": "GET",
        "url": "/api/users",
        "handler": user.getUsers
    },
    {
        "method": "GET",
        "url": "/api/users/:id",
        "handler": user.getUsers
    },
    {
        "method": "GET",
        "url": "/api/usersdata/:id",
        "handler": user.getUsersData
    },
    {
        "method": "PATCH",
        "url": "/api/user/:id",
        "handler": user.patchUser
    }
];

const teamApiRoutes = [{
        "method": "GET",
        "url": "/api/teams",
        "handler": team.getTeams
    },
    {
        "method": "POST",
        "url": "/api/team",
        "handler": team.createTeam
    },
    {
        "method": "PATCH",
        "url": "/api/teams/:id",
        "handler": team.renameTeam
    }
];

const questionApiRoutes = [{
        "method": "POST",
        "url": "/api/question",
        "handler": question.postQuestion
    },
    {
        "method": "GET",
        "url": "/api/questions",
        "handler": question.getQuestions
    },
    {
        "method": "GET",
        "url": "/api/questions/:id",
        "handler": question.getQuestionsId
    },
    {
        "method": "GET",
        "url": "/api/questionsdata/:id",
        "handler": question.getQuestionsDataId
    }
];

exports.apiRoutes = [
    userApiRoutes,
    teamApiRoutes,
    answerApiRoutes,
    questionApiRoutes
];