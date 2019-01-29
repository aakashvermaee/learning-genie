const mongoServiceBaseUri = "http://localhost:2019"

const answer = {
  postAnswer: `${mongoServiceBaseUri}/api/answer`
};

const user = {
  getUser: `${mongoServiceBaseUri}/api/user`,
  getUsers: `${mongoServiceBaseUri}/api/users`,
  getUsersById: `${mongoServiceBaseUri}/api/users`,
  getUsersDataById: `${mongoServiceBaseUri}/api/usersdata`,
  patchUserById: `${mongoServiceBaseUri}/api/user`
};

const team = {
  getTeams: `${mongoServiceBaseUri}/api/teams`,
  createOrPostTeam: `${mongoServiceBaseUri}/api/team`,
  patchTeamById: `${mongoServiceBaseUri}/api/team`
};

const question = {
  postQuestion: `${mongoServiceBaseUri}/api/question`,
  getQuestions: `${mongoServiceBaseUri}/api/questions`,
  getQuestionsById: `${mongoServiceBaseUri}/api/questions`,
  getQuestionsDataById: `${mongoServiceBaseUri}/api/questionsdata`
};

module.exports = {
  team,
  user,
  answer,
  question
}