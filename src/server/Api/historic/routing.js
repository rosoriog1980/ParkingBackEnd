const router = require('express').Router();
const { historicByParkingId } = require('./historic.controller');

router.get('/parking', historicByParkingId);

module.exports = router;