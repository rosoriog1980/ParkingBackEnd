const status = require('http-status');
const User = require('./user.model');
const Guid = require('guid');
var Config = require('../config');


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
    const Token = req.get('Token');

    if (Token.includes('Admin')) {
        User.find({})
        .then(respondWithResult(res))
        .catch(respondWithError(res));
    } else {
        User.find({loginToken: Token},'-userPassword -loginToken')
        .populate('branchOfficeId')
        .then(respondWithResult(res))
        .catch(respondWithError(res));
    }
}

function searchUser(req, res) {
    const userId = req.query.userId;

    User.find({_id: userId},'-userPassword -loginToken')
        .populate('branchOfficeId')
        .then(respondWithResult(res))
        .catch(respondWithError(res));
}

function createUser(req, res) {
    const user = req.body.user;
    const vehicles = req.body.vehicles;

    var hash = makeHash();
    var userEmail = user.userEmail;

    user.hash = hash

    User.create(user)
    .then(user => addVehicles(user, vehicles))
    .then(respondWithResult(res))
    .catch(respondWithError(res));

    
    var transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
            user: Config.gmail.user_name,
            pass: Config.gmail.password
        }
    });
    
    const mailOptions = {
        to: userEmail, // list of receivers
        subject: 'Parqueo PSL - Activa tu usuario', // Subject line
        html: '<br><h1 style="text-align: center;"><span style="color: #008080;"><strong>PARQUEO</strong></span></h1><br><p style="text-align: center;">Bienvenido a Parqueo. Activa tu cuenta:</p><h2 style="text-align: center;"><span style="background-color: #008080;"><strong><span style="color: #ffffff;"><a href="' + urlSetPassword + hash +'" style="color: #ffffff;">&nbsp;ACTIVAR&nbsp;</a></span></strong></span></h2><p style="text-align: center;"></p>'// plain text body
    };  

    transporter.sendMail(mailOptions, function (err, info) {
        if(err)
          return res.status(500).send({message: 'Error en la petición.'});
          
        return res.status(200).send({message: 'Envio exitoso.'});
     });
}

function makeHash() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  
    for (var i = 0; i < 20; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));
  
    return text;
  }

function deleteUser(req, res) {
    User.findByIdAndRemove(req.query.id)
    .then(respondWithResult(res))
    .catch(respondWithError(res));
}

function updateUser(req, res) {
    const user = req.body.user;
    User.findByIdAndUpdate(user._id, { $set:{userTelNumber: user.userTelNumber, 
        branchOffice: user.branchOffice, vehicles: user.vehicles } }, {new: true})
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
        const v = user.vehicles.find(v => v.vehicleLicensePlate === element.vehicleLicensePlate);
        if (v === undefined) {
            user.vehicles.push(element);
        }
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
    getUsers, searchUser, createUser, deleteUser, updateUser, newVehicle, removeVehicle, loginUser, apiValidateToken
};