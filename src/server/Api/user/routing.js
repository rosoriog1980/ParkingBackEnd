const router = require('express').Router();
const User = require('./user.model');
const { getUsers, searchUser, createUser, deleteUser, updateUser, newVehicle, removeVehicle, loginUser, apiValidateToken } = require('./user.controller');

router.post('/auth', loginUser);
router.post('/validAuth', apiValidateToken)
router.post('/', createUser);

router.get('/', isAuthenticated,  getUsers);
router.get('/find', isAuthenticated, searchUser);
router.put('/', isAuthenticated, updateUser);
router.delete('/', isAuthenticated, deleteUser);
router.post('/updatePassword', updatePassword);

updatePassword

router.post('/vehicle', newVehicle);
router.delete('/vehicle',  removeVehicle);

function isAuthenticated(req, res, next){
    const Token = req.get('Token');
    
    User.findOne({loginToken: Token})
    .then(user => {
        if (user != null) {
            return next();    
        } else {
            res.status(404);
            return res.send('Bad Request.');
        }
    })
    .catch(err => {
        res.status(404);
        return res.send('Bad Request.');
    });
}


module.exports = router; 