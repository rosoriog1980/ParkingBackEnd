const router = require('express').Router();
const { getUsers, createUser, deleteUser, newVehicle, removeVehicle, loginUser, apiValidateToken } = require('./user.controller');

router.get('/', getUsers);
router.post('/', createUser);
router.post('/vehicle', newVehicle);
router.post('/auth', loginUser);
router.post('/validAuth', apiValidateToken)
router.delete('/', deleteUser);
router.delete('/vehicle', removeVehicle);

module.exports = router; 