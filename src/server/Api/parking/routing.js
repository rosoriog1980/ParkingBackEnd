const router = require('express').Router();
const { getParkingLots, newParking, changeStatus, deleteParking } = require('./parking.controller');

router.get('/', getParkingLots);
router.post('/', newParking);
router.put('/', changeStatus);
router.delete('/', deleteParking);

module.exports = router; 