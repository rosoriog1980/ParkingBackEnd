const mongoose = require('mongoose');
const {Schema} = require('mongoose');

const parkingSchema = new Schema({
    parkingStatus: {type: String, required: true},
    parkingNumber: {type: Number, required: true},
    floorNumber: {type: Number, required: true},
    userId: {type: Schema.Types.ObjectId, ref: 'User', required:false}
});

module.exports = mongoose.model('Parking', parkingSchema);