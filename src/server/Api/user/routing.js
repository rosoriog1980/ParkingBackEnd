const router = require('express').Router();
const { getUsers, createUser, deleteUser, newVehicle, removeVehicle } = require('./user.controller');

router.get('/', getUsers);
router.post('/', createUser);
router.post('/vehicle', newVehicle);
router.delete('/', deleteUser);
router.delete('/vehicle', removeVehicle);

module.exports = router; 