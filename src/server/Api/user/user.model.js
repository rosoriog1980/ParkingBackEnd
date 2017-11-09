const mongoose = require('mongoose');
const {Schema} = require('mongoose');

const userSchema = new Schema({
    userName: {type: String, required: true},
    userEmail: {type: String, required: true},
    userTelNumber: {type: String, required: true},
    userImage: {type: String, required: false}
});

module.exports = mongoose.model('User', userSchema);