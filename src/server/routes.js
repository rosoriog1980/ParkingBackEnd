const parkingRouter = require('./Api/parking/routing');
const userRouter = require('./Api/user/routing');
const cors = require('cors');

function setRoutes(app){
    app.use(cors());
    app.use('/api/parking', parkingRouter);
    app.use('/api/user', userRouter);
}

module.exports = setRoutes;