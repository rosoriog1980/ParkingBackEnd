const status = require('http-status');
const User = require('./user.model');
const Guid = require('guid');


function respondWithResult(res, code) {
    const statusCode = code || status.OK;
    return (result) => {
        if (result) {
            return res.status(statusCode).json(result);
        }
        if (result === 0) {
            return res.status(statusCode).json(result);
        }
        return res.status(statusCode);
    };
}
  
function respondWithError(res, code) {
    const statusCode = code || status.INTERNAL_SERVER_ERROR;
    return err => res.status(statusCode).send(err);
}

function getUsers(req, res) {
    User.find({})
    .then(respondWithResult(res))
    .catch(respondWithError(res));
}

function createUser(req, res) {
    const user = req.body.user;
    const vehicles = req.body.vehicles;

    User.create(user)
    .then(user => addVehicles(user, vehicles))
    .then(respondWithResult(res))
    .catch(respondWithError(res));
}

function deleteUser(req, res) {
    User.findByIdAndRemove(req.query.id)
    .then(respondWithResult(res))
    .catch(respondWithError(res));
}

function newVehicle(req, res) {
    User.findOne({_id: req.body.userId})
    .then(user=> addVehicles(user, req.body.vehicles))
    .then(respondWithResult(res))
    .catch(respondWithError(res));
}

function removeVehicle(req, res) {
    const user = User.findOne({_id: req.body.userId})
    .then(user=> deleteVehicle(user, req.body.vehicleId))    
    .then(respondWithResult(res))
    .catch(respondWithError(res));
}

function addVehicles(user, vehicles) {
    
    vehicles.forEach(element => {
        user.vehicles.push(element);
    });

    return user.save();
}

function deleteVehicle(user, vehicleId){
    let indexToRemove = undefined;
    user.vehicles.forEach(function(element, index) {
        if (element._id == vehicleId) {
            indexToRemove = index;
        }
    });
    if (indexToRemove != undefined) {
        user.vehicles.splice(indexToRemove, 1);
    }
    
    return user.save();
}

function loginUser(req, res) {
    const userName = req.body.user;
    const userPwd = req.body.pwd;

    User.findOne({userEmail: userName, userPassword: userPwd})
    .then(user => {
        user.loginToken = Guid.raw();
        user.save();
        res.send(user.loginToken);
        respondWithResult(res);
    })
    .catch(err => {
        res.status = status.OK;
        res.send("");
        respondWithResult(res);
        }
    );
}

function apiValidateToken(req, res){
    const token = req.body.usr;
    User.findOne({loginToken: token})
    .then(user => {
        user.loginToken = Guid.raw();
        user.save();
        res.send({result: true, newId: user.loginToken});
        respondWithResult(res);
    })
    .catch(err => {
        res.send({result: false});
        respondWithResult(res);
    });
}


module.exports= {
    getUsers, createUser, deleteUser, newVehicle, removeVehicle, loginUser, apiValidateToken
};