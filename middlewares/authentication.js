/**
 * Requires
 */

const express = require('express');
const jwt = require('jsonwebtoken');
const SEED = require('../config/config').SEED;

/**
 * Variables initialization
 */

var app = express();

/**
 * Validate Token function
 */

exports.verifyToken = (req, res, next) => {

    const userToken = req.query.token;

    jwt.verify(userToken, SEED, (err, decoded) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                message: 'Invalid Token',
                erros: err,
            });
        }

        req.user = decoded.userDB;
        decoded.userDB.password = ':)';

        next();



        // return res.status(200).json({
        //     ok: true,
        //     message: 'Valid Token',
        //     user: decoded,
        // });

    });

}