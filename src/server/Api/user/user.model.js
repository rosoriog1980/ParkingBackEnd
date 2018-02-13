const mongoose = require('mongoose');
const {Schema} = require('mongoose');

const userSchema = new Schema({
    userName: {type: String, required: true},
    userEmail: {type: String, required: true},
    userTelNumber: {type: String, required: true},
    branchOffice: {type: String, required: false},
    userImage: {type: String, required: false},
    vehicles:[
        {
            vehicleLicensePlate: {type: String, required: false},
            vehicleBrand: {type: String, required: false},
            vehicleModel: {type: String, required: false},
            vehicleImage: {type: String, required: false}
        }
    ]
});

module.exports = mongoose.model('User', userSchema);
