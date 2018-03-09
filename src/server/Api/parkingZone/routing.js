const router = require('express').Router();
const { newZone, getZones } = require('./parkingZone.controller');

router.get('/', getZones);
router.post('/', newZone);

module.exports = router;