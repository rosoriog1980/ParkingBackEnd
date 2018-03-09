const parkingRouter = require('./Api/parking/routing');
const userRouter = require('./Api/user/routing');
const historicRouter = require('./Api/historic/routing');
const branchOfficeRouter = require('./Api/branchOffice/routing');
const parkingZoneRouter = require('./Api/parkingZone/routing');
const cors = require('cors');

function setRoutes(app){
    app.use(cors());
    app.use('/api/parking', parkingRouter);
    app.use('/api/user', userRouter);
    app.use('/api/historic', historicRouter);
    app.use('/api/branchOffice', branchOfficeRouter);
    app.use('/api/parkingZone', parkingZoneRouter);
}

module.exports = setRoutes;