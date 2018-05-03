const mongoose = require('mongoose');
const {Schema} = require('mongoose');

const passwordChangeTokenSchema = new Schema({
    userName: {type: String, required: true},
    hash: {type: String, required: true}
    
});

module.exports = mongoose.model('passwordChangeToken', passwordChangeTokenSchema);
