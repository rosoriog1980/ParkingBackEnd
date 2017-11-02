const router = require('express').Router();
const { getParkingLots, newParking } = require('./parking.controller');

router.get('/', getParkingLots);
router.post('/', newParking);
module.exports = router; 