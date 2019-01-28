const { mongoose } = require('./db');

var EmployeeSchema = new mongoose.Schema({
    'E-MAIL': {
        type: String,
        required: true,
        minlength: 1,
        unique: true,
        trim: true
    },
    'Name': {
        type: String,
        required: true
    }
})
var IndiaEmployee = mongoose.model('IndiaEmployees', EmployeeSchema);
module.exports = { IndiaEmployee }