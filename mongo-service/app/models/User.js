const { mongoose } = require('./db');

var UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        minlength: 1,
        unique: true,
        trim: true
    },
    isAdmin: {
        type: Boolean,
        required: true,
        default: false
    },
    token: {
        type: String,
        required: true
    },
    team: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Teams',
        required: true
    }]
})

UserSchema.methods.findUser = async function (token) {
    let users;
    try {
        users = await this.find({ token }).catch((err) => { process.logger(undefined, err) });
        if (users) {
            const user = users.next();
            return user;
        }
    } catch (err) {
        process.logger(undefined, err);
    }
}

var User = mongoose.model('Users', UserSchema);
module.exports = { User }