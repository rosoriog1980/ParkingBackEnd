const status = require('http-status');
const Parking = require('./parking.model');
const ParkingZone = require('../parkingZone/parkingZone.model');
const parkingStatusEnum = require('./parking.statusEnum');
const { createHistoric } = require('../historic/historic.controller');
const { getZones } = require('../parkingZone/parkingZone.controller');

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
    const zoneId = req.query.zoneId;
    if (zoneId !== undefined) {
        Parking.find({"parkingZone.parkingZoneId": zoneId})
        .then(respondWithResult(res))
        .catch(respondWithError(res));
    } else {
        Parking.find({})
        .then(respondWithResult(res))
        .catch(respondWithError(res));
    }
}

function newParking(req, res) {
    const parking = req.body.parking;
    parking.parkingStatus = parkingStatusEnum.AVAILABLE;

    Parking.create(parking)
    .then(respondWithResult(res))
    .catch(respondWithError(res));
}

function changeStatus(req, res) {
    const { id, status, userId, spaceId } = req.body;
    const user = status === 'AVAILABLE' ? undefined : userId;
    Parking.update({"_id": id, "parkings._id": spaceId}, 
        {$set: {"parkings.$.parkingStatus": status, "parkings.$.userId": user}}, {new: true})
    .then(res => createHistoric(id, userId, status))
	.then(respondWithResult(res))
	.catch(respondWithError(res));
}

function deleteParking(req, res) {
    Parking.findByIdAndRemove(req.query.id)
    .then(respondWithResult(res))
    .catch(respondWithError(res));
}

function removeParkingSpace(parking, spaceId){
    let indexToRemove = undefined;
    parking.parkings.forEach(function(element, index){
        if (element._id === spaceId) {
            indexToRemove = index;
        }
    });
    if (indexToRemove !== undefined) {
        parking.parkings.splice(indexToRemove,1);
    }

    return parking.save();
}

function homeQuery(req, res){
    const officeId = req.query.officeId;
    let countAvailable = 0;
    const idZones = []; 
    ParkingZone.find({branchOfficeId: officeId})
    .then(zones => {
        zones.forEach(item => {
            idZones.push(item._id);
        });
        getAvailableParkingsInZone(idZones)
        .then(resul => {
            addZoneName(zones, resul)
            .then(homeInfo => {
                res.send(homeInfo.sort(sortResul));
                respondWithResult(res);
            })
        });
    });
}

function getAvailableParkingsInZone(zones){
    const rules = [{'parkingZone.parkingZoneId':{ $in: zones}, "parkings.parkingStatus": "AVAILABLE" }];
    return new Promise(resolve =>{
        Parking.aggregate([
            {$unwind: ("$parkings")},
            { $match: {$and: rules}},
            {
                $group: {
                    _id: '$parkingZone.parkingZoneId',
                    count: {$sum: 1}
                }
            },
            
        ], function(err,result){
            resolve(result);
        });
    });
}

function addZoneName(zones, homeQ){
    resulHomeQ = [];
    return new Promise(resolve => {
        homeQ.forEach(item => {
            item.zoneName = zones.find(z =>{
                 return z._id.toString() === item._id.toString()
                })["zoneName"];
        });
        resolve(homeQ);
    });
}

function sortResul(a, b){
    if (a.zoneName > b.zoneName) {
        return 1;
      }
      if (a.zoneName < b.zoneName) {
        return -1;
      }
      return 0;
}

module.exports = {
    getParkingLots, newParking, changeStatus, deleteParking, homeQuery
};