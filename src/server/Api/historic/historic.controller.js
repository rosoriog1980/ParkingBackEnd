const status = require('http-status');
const Historic = require('./historic.model');

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

function createHistoric(parking) {
    const historic = new Historic({
        parkingId: parking._id,
        userId: parking.userId,
        parkingStatus: parking.parkingStatus
    });

    return historic.save();
}

function historicByParkingId(req, res) {
    Historic.find({parkingId: req.query.parkingId})
    .sort({changeStatusDate: 1})
    .then(respondWithResult(res))
    .catch(respondWithError(res));
}

module.exports = {
    createHistoric,
    historicByParkingId
}