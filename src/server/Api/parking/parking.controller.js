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
    const { status, userId, spaceId } = req.body;
    const user = status === 'AVAILABLE' ? undefined : userId;
    Parking.update({"parkings._id": spaceId}, 
        {$set: {"parkings.$.parkingStatus": status, "parkings.$.userId": user}}, {new: true})
    .then(res => createHistoric(spaceId, userId, status))
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
            addZoneInfo(zones, resul)
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

function addZoneInfo(zones, homeQ){
    return new Promise(resolve => {
        zones.forEach(item => {
            var homeInfo = homeQ.find(i => {
                return i._id.toString() === item._id.toString()
            });
            if (homeInfo !== undefined) {
                homeInfo.zoneName = item.zoneName;
            }else {
                homeQ.push({
                    _id: item._id,
                    count: 0,
                    zoneName: item.zoneName
                });
            }
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