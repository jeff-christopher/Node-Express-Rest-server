/**
 * Requires 
 */

const express = require('express');

/**
 * Initializations
 */

const app = express();

/**
 * Routes
 */

app.get('/', (req, res, next) => {

    res.status(200).json({
        ok: true,
        message: 'Request done correctly.',
    });

});

module.exports = app;