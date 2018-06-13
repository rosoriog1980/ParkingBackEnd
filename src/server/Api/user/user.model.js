const mongoose = require('mongoose');
const {Schema} = require('mongoose');

const userSchema = new Schema({
    userName: {type: String, required: true},
    userEmail: {type: String, required: true},
    userTelNumber: {type: String, required: true},
    branchOfficeId: {type: Schema.Types.ObjectId, ref: 'BranchOffice', required:true},
    userImage: {type: String, required: false},
    userPassword: {type: String, required: false},
    loginToken: {type: String, required: false},
    vehicles:[
        {
            vehicleLicensePlate: {type: String, required: false},
            vehicleBrand: {type: String, required: false},
            vehicleColor: {type: String, required: false},
            vehicleImage: {type: String, required: false}
        }
    ],
    active: {type: Boolean, required: true, default: false}
    
}, {
    usePushEach: true
});

module.exports = mongoose.model('User', userSchema);
