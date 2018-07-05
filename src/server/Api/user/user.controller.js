const status = require('http-status');
const User = require('./user.model');
const PasswordChangeToken = require('./passwordChangeToken.model');
const Guid = require('guid');
const Config = require('../../config/config');
const Nodemailer = require('nodemailer');
var bcrypt = require('bcrypt-nodejs');


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
        
    var user = req.body.user;

    const vehicles = req.body.vehicles;

    var hash = makeHash();
    var userEmail = user.userEmail;
    
    var passwordChangeToken = new PasswordChangeToken;
    passwordChangeToken.userName = user.userName;
    passwordChangeToken.hash = hash 

    User.findOne({ $or:[ {'userName': user.userName}, {'userEmail':user.userEmail} ] }, function (err, registredUser) {
        if(registredUser){
            return res.status(404).send({
                message: 'El username o email ya fue registrado, por favor intente con uno nuevo.'
            })}        

        User.create(user)
        .then(user => addVehicles(user, vehicles))
        .then(function(result){
            passwordChangeToken.save().then(item => {

                var transporter = Nodemailer.createTransport({
                    service: "Gmail",
                    auth: {
                        user: Config.gmail.userName,
                        pass: Config.gmail.password            
                    }
                });

                var urlWebApp = Config.web.url + '/newpassword/' + hash;

                const mailOptions = {
                    to: userEmail, // list of receivers
                    subject: 'Parqueo PSL - Activa tu usuario', // Subject line
                    html: '<div style="font-family: sans-serif !important;"><br /><h1 style="text-align: center;"><span style="color: #808080;"><strong>PARQUEO</strong></span></h1><p>&nbsp;</p><p style="text-align: center;">Bienvenido a Parqueo. Activa tu cuenta:</p><p>&nbsp;</p><h2 style="text-align: center;"><a style="color: #ffffff; font-size: 25px !important; border-radius: 100px; background-color: #ff6500; height: 50px; padding: 0.6em; text-decoration: none;" href="' + urlWebApp + '"><span style="color: #ffffff;">&nbsp;ACTIVAR&nbsp;</span></a></h2></div>'
                };  

                transporter.sendMail(mailOptions, function (err, info) {

                    if(err)
                        return respondWithResult({message: 'Error en la petición.'}, 500)
                    
                    return res.status(200).send({
                        message: 'Registro exitoso.'
                    })
                });
            })
            .catch(err => {
                res.status(400).send("unable to save to database");
            })
        }, function (err){
            if(err) return respondWithResult({message: 'Error en la petición.'}, 500)  
        })
        .catch(respondWithError(res))
    })    
}

function makeHash() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  
    for (var i = 0; i < 20; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));
  
    return text;
}

function updatePassword(req, res){    
    var params = req.body;

    var hash = params.hash;
    var userName;

    PasswordChangeToken.findOne({ 'hash': hash }, (err, passwordChangeToken) => {
        if (err) return res.status(500).send({message: 'Error en la petición.'});
        
        userName = passwordChangeToken.userName;
        PasswordChangeToken.find({ 'hash': hash }).remove()
        .then(
            User.findOne({ 'userName': userName }, function (err, user) {
                if (err) return handleError(err);
        
                //Cifrar contraseña y guardar los datos
                bcrypt.hash(params.newPassword, null, null, (err, hash) => {
                    if (err) return handleError(err);
                    user.userPassword = hash;
                    user.active = true;

                    try{

                        user.save((err, userStored) => {
                            if(err){
                                return res.status(500).send({
                                    message: 'Error al guardar el usuario.'
                                })
                            }
                            if(userStored){
                                res.status(200).send({
                                    user: userStored
                                })
                            }else{
                                res.status(404).send({
                                    message: 'No se ha registrado el usuario.'
                                })
                            }
                        })
                    } catch(e) {
                        let errors = e.errors;
                        res.jsonp({
                            errors,
                            success: false
                        });
                    }
                })      
            })
        )
    });    
    
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
    const userEmail = req.body.user;
    const userPwd = req.body.pwd;

    User.findOne({userEmail: userEmail})
    .then(user => {
        bcrypt.compare(userPwd, user.userPassword, (err, check) => {
            if(err){
                return res.status(500).send({
                    message: 'Error en la petición.'
                })                
            }
            if(check){
                if(params.getToken){
                    // generar y enviar el token
                    return res.status(200).send({
                        token: jwt.createToken(user)
                    });
                }else{
                    // devolver datos de usuario
                    user.loginToken = Guid.raw();
                    user.save();
                    res.send(user.loginToken);
                    respondWithResult(res);
                }
            }else{
                return res.status(404).send({
                    message: 'Contraseña errada.'
                })
            }
        })
    })
    .catch(err => {
        res.status = status["404"];
        res.send("El usuario no existe");
        respondWithResult(res);
        }
    );
}

function loginUserBk(req, res) {
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
    getUsers, 
    searchUser, 
    createUser, 
    deleteUser, 
    updateUser, 
    newVehicle, 
    removeVehicle, 
    loginUser, 
    apiValidateToken, 
    updatePassword
};