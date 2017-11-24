const mongoose = require('mongoose');
const {Schema} = require('mongoose');

const historicSchema = new Schema({
    parkingId: {type: Schema.Types.ObjectId, ref: 'Parking', required: true},
    userId: {type: Schema.Types.ObjectId, ref: 'User', required: false},
    parkingStatus: {type: String, required: true},
    changeStatusDate: {type: Date, required: true, default: Date.now}
});

module.exports = mongoose.model('Historic', historicSchema);