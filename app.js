/**
 * Requires
 */

const express = require('express');
const mongoDb = require('mongoose');

/**
 * Variables initialization
 */

var app = express();
const SERVER_PORT = 3000;
const DB_PORT = 27017;
const DB_URI = `mongodb://localhost:${ DB_PORT }/hospitalDB`;

/**
 * Routes
 */

app.get('/', (requets, response, next) => {

    response.status(200).json({
        ok: true,
        message: 'Request done correctly.',
    })

})

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