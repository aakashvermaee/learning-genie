const { mongoose } = require('./db');

var QuestionSchema = new mongoose.Schema({
    ques: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    keys: {
        type: String,
        required: true
    },
    atTime: {
        type: String,
        required: true
    },
    team: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Teams',
        required: true
    }
})
QuestionSchema.statics.checkAns = async function (body) {
    let question = await this.findById(body.q_id).catch(e => { process.logger(JSON.stringify(e, null, 2)) })
    if (question) {
        let ans = question.keys.split(",")
        for (let i = 0; i < ans.length; i++) {
            if (body.ans.indexOf(ans[i]) > -1)
                return true
        }
        return false
    }
    else
        process.logger("Question not found")
}

QuestionSchema.methods.findQuestion = async function (token) {
    let question;
    try {
        question = await this.find({ token }).catch((err) => { process.logger(undefined, err) });
        if (question) {
            const ques = question.next();
            return ques;
        }
    } catch (err) {
        process.logger(undefined, err);
    }
}

var Question = mongoose.model('Question', QuestionSchema);
module.exports = { Question }