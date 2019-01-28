const { mongoose } = require("./db");

const TeamSchema = new mongoose.Schema({
    teamName: {
        type: String,
        required: true,
        minlength: 1,
        unique: true,
        trim: true
    }
})

const Team = mongoose.model('Teams', TeamSchema);

module.exports.Team = Team;