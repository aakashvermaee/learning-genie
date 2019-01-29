const mongoServiceBaseUri = "http://localhost:2019"

const answerApiRoutes = {
  postAnswer: `${mongoServiceBaseUri}/api/answer`
};

const userApiRoutes = {
  getUser: `${mongoServiceBaseUri}/api/user`,
  getUsers: `${mongoServiceBaseUri}/api/users`,
  getUsersById: `${mongoServiceBaseUri}/api/users/:id`,
  getUsersDataById: `${mongoServiceBaseUri}/api/usersdata/:id`,
  patchUserById: `${mongoServiceBaseUri}/api/user/:id`
};

const teamApiRoutes = {
  getTeams: `${mongoServiceBaseUri}/api/teams`,
  createOrPostTeam: `${mongoServiceBaseUri}/api/team`,
  patchTeamById: `${mongoServiceBaseUri}/api/team/:id`
};

const questionApiRoutes = {
  postQuestion: `${mongoServiceBaseUri}/api/question`,
  getQuestions: `${mongoServiceBaseUri}/api/questions`,
  getQuestionsById: `${mongoServiceBaseUri}/api/questions/:id`,
  getQuestionsDataById: `${mongoServiceBaseUri}/api/questionsdata/:id`
};

module.exports = {
  teamApiRoutes,
  userApiRoutes,
  answerApiRoutes,
  questionApiRoutes
}