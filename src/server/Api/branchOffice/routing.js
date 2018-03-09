const router = require('express').Router();
const { newOffice, getOffices } = require('./branchOffice.controller');

router.get('/', getOffices);
router.post('/', newOffice);

module.exports = router;