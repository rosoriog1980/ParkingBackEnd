const express = require('express');
const configServer = require('./config/server');
const setupDb = require('./config/database');
const routerConfig = require('./routes');

const app = express();
const PORT = process.env.PORT || 3000;

const db = setupDb();
configServer(app);
routerConfig(app);

db.on('error', console.error.bind(console, 'Connection Error : '));
db.once('open', ()=> {
    app.listen(PORT, () => {
        console.log(`Server listening at http://localhost:${PORT} ...`); 
    });
});
