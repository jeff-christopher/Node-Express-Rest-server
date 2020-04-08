/**
 * Requires
 */

const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const SEED = require('../config/config').SEED;

/**
 * Models
 */
const User = require('../models/user');


/**
 * Initializations
 */
const app = express();

/**
 * Login Routes
 */

app.post('/', (req, res, next) => {

    const body = req.body;

    const email = body.email;
    const password = body.password;

    User.findOne({ email: email }, (err, userDB) => {

        if (err) {
            return res.status('500').json({
                ok: false,
                message: 'Error getting users',
                errors: err,
            });
        }

        if (!userDB) {
            return res.status('400').json({
                ok: false,
                message: 'wrong credentials - email',
                errors: err,
            });
        }

        if (!bcrypt.compareSync(password, userDB.password)) {
            return res.status('400').json({
                ok: false,
                message: 'wrong credentials - password',
                errors: err,
            });
        }

        //Token Creation!!

        const token = jwt.sign({ userDB }, SEED, { expiresIn: 7200 });

        userDB.password = ':)';

        res.status(200).json({
            okay: 'true',
            message: 'Login route working :)',
            user: userDB,
            token: token,
            id: userDB.id,
        });


    })
})

module.exports = app;