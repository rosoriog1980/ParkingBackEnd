const status = require('http-status');
const Parking = require('./parking.model');
const parkingStatusEnum = require('./parking.statusEnum');

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


function getParkingLots(req, res){
    Parking.find({})
    .then(respondWithResult(res))
    .catch(respondWithError(res));
}

function newParking(req, res) {
    const parking = req.body.parking;
    parking.parkingStatus = parkingStatusEnum.AVAILABLE;

    Parking.create(parking)
    .then(respondWithResult(res))
    .catch(respondWithError(res));
}

module.exports = {
    getParkingLots, newParking
};