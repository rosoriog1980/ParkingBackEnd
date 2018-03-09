const status = require('http-status');
const BranchOffice = require('./branchOffice.model');

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

function newOffice(req, res) {
    const office = req.body.office;

    BranchOffice.create(office)
    .then(respondWithResult(res))
    .catch(respondWithError(res));
}

function getOffices(req, res) {
    BranchOffice.find({})
    .then(respondWithResult(res))
    .catch(respondWithError(res));
}

module.exports = {
    newOffice, getOffices
};