const router = require('express').Router();
const { getParkingLots, newParking, changeStatus, deleteParking, homeQuery } = require('./parking.controller');

router.get('/', getParkingLots);
router.get('/home', homeQuery);
router.post('/', newParking);
router.put('/', changeStatus);
router.delete('/', deleteParking);

module.exports = router; 