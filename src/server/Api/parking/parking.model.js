const mongoose = require('mongoose');
const {Schema} = require('mongoose');

const parkingFieldSchema = new Schema({
    parkingZone: {
        parkingZoneId: {type: Schema.Types.ObjectId, ref: 'ParkingZone', required:true},
        zoneName: {type: String, required: true}
    },
    floorNumber: {type: Number, required: true},
    parkings: [
        {
            parkingNumber: {type: Number, required: true},
            blocked: {type: Boolean, required: true, default: false},
            parkingStatus: {type: String, required: true},
            userId: {type: Schema.Types.ObjectId, ref: 'User', required:false}
        }
    ]
});

module.exports = mongoose.model('Parking', parkingFieldSchema);