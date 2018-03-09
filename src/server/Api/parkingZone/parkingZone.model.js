const mongoose = require('mongoose');
const {Schema} = require('mongoose');

const parkinZoneSchema = new Schema({
    zoneName: {type: String, required: true},
    branchOfficeId: {type: Schema.Types.ObjectId, ref: 'BranchOffice', required: true}
});

module.exports = mongoose.model('ParkingZone', parkinZoneSchema);