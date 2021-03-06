/**
 * Requires
 */

const express = require('express');
const mongoDb = require('mongoose');
const bodyParser = require('body-parser')

/**
 * Routes Import
 */

const appRoutes = require('./routes/app');
const userRoutes = require('./routes/user');
const loginRoutes = require('./routes/login');
const hospitalRoutes = require('./routes/hospital');
const doctorRoutes = require('./routes/doctor');
const searchRoutes = require('./routes/search');
const uploadRoutes = require('./routes/upload');
const imageRoutes = require('./routes/image');

/**
 * Variables initialization
 */

var app = express();
const SERVER_PORT = require('./config/config').SERVER_PORT;
const DB_PORT = require('./config/config').DB_PORT;
const DB_URI = require('./config/config').DB_URI;

/**
 * Body Parser config
 */

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

/**
 * Routes/Middlewares
 */
app.use('/user', userRoutes);
app.use('/login', loginRoutes);
app.use('/hospital', hospitalRoutes);
app.use('/doctor', doctorRoutes);
app.use('/search', searchRoutes);
app.use('/upload', uploadRoutes);
app.use('/image', imageRoutes);
app.use('/', appRoutes);


/**
 * Data Base Connection
 */

mongoDb.connection.openUri(DB_URI, (err, resp) => {

    if (err) throw err;

    console.log(`Mongo DB running on port ${DB_PORT}: \x1b[32m%s\x1b[0m `, `Online ...`);


})


/**
 * Listen requets
 */

app.listen(SERVER_PORT, () => {
    console.log(`Express server running on port ${SERVER_PORT}: \x1b[32m%s\x1b[0m `, `Online ...`);
});