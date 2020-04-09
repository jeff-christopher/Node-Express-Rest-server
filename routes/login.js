/**
 * Requires
 */

const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const SEED = require('../config/config').SEED;
const CLIENT_ID = require('../config/config').CLIENT_ID;

/**
 * Models
 */
const User = require('../models/user');

/**
 * Google configuration
 */

const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(CLIENT_ID);


/**
 * Initializations
 */
const app = express();

/**
 * Login Routes
 */

// Google sigin

app.post('/google', async(req, res, next) => {

    const token = req.body.token;
    const googleUser = await verify(token)
        .catch(err => {
            return res.status(401).json({
                ok: false,
                message: 'Invalid Token',
                errors: err,
            });

        });

    User.findOne({ email: googleUser.email }, (err, userDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'Error searching user by email',
                errors: err
            });
        }

        if (userDB) {

            if (userDB.google === false) {
                return res.status(400).json({
                    ok: false,
                    message: 'You must use Normal Login. (email, password)',
                    errors: { message: 'You must use Normal Login. (email, password)' },
                });
            } else {

                const token = jwt.sign({ userDB }, SEED, { expiresIn: 7200 });

                userDB.password = ':)';

                res.status(200).json({
                    okay: 'true',
                    user: userDB,
                    token: token,
                    id: userDB.id,
                });
            }
        } else {

            const newGoogleUser = new User({
                name: googleUser.name,
                email: googleUser.email,
                password: ':)',
                image: googleUser.image,
                google: true,
            });

            newGoogleUser.save((err, savedGoogleUser) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        message: 'Error saving new Google User',
                        errors: err
                    });
                }

                const token = jwt.sign({ savedGoogleUser }, SEED, { expiresIn: 7200 });

                return res.status(200).json({
                    ok: true,
                    googleUser: savedGoogleUser,
                    token: token,
                });

            });
        }
    });
});


async function verify(token) {

    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });

    const payload = ticket.getPayload();

    return {
        name: payload.name,
        email: payload.email,
        image: payload.picture,
        google: true,
    };
}



// Email and password login
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