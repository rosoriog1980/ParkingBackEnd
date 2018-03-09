const status = require('http-status');
const ParkingZone = require('./parkingZone.model');

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

function newZone(req, res) {
    const zone = req.body.zone;

    ParkingZone.create(zone)
    .then(respondWithResult(res))
    .catch(respondWithError(res));
}

function getZones(req, res) {
    const officeId = req.query.officeId;

    ParkingZone.find({branchOfficeId: officeId})
    .then(respondWithResult(res))
    .catch(respondWithError(res));
}

module.exports = {
    newZone, getZones
};