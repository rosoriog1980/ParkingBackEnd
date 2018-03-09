const mongoose = require('mongoose');
const {Schema} = require('mongoose');

const branchOfficeSchema = new Schema({
    officeName: {type: String, required: true},
    officeAddress: {type: String, required: false}
});

module.exports = mongoose.model('BranchOffice', branchOfficeSchema);