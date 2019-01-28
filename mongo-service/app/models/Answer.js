const { mongoose } = require('./db');

var AnswerSchema = new mongoose.Schema({
    ans: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    correct: {
        type: Boolean,
        required: true,
        default: false
    },
    q_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question',
        required: true
    },
    u_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    },
    atTime: {
        type: String,
        required: true
    }
})

var Answer = mongoose.model('Answers', AnswerSchema);
module.exports = { Answer }