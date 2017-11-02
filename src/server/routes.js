const parkingRouter = require('./Api/parking/routing');
const userRouter = require('./Api/user/routing');

function setRoutes(app){
    app.use('/api/parking', parkingRouter);
    app.use('/api/user', userRouter);
}

module.exports = setRoutes;