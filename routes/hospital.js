/**
 * requires
 */

const express = require('express');
const mdAuthentication = require('../middlewares/authentication');

/**
 * Initializations
 */
const app = express();

/**
 * Models
 */

const Hospital = require('../models/hospital');

/**
 * Routes
 */

// Get Hospital

app.get('/', (req, res, next) => {

    let from = req.params.from || 0;
    from = Number(from);

    Hospital.find({}, (err, data) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    message: 'Error getting hospitals',
                    errors: err,
                });
            }

            Hospital.countDocuments({}, (err, count) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        message: 'Error counting records',
                        errors: err
                    });
                }

                res.status(200).json({
                    ok: true,
                    hospitals: data,
                    total: count,
                });

            });


        })
        .limit(5)
        .skip(from)
        .populate('user', 'name email');
});

// Create Hospital

app.post('/', mdAuthentication.verifyToken, (req, res, next) => {

    const body = req.body;

    const newHospital = new Hospital({
        name: body.name,
        image: body.image,
        user: req.user._id,
    });

    newHospital.save((err, data) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'Error creating hospital.',
                errors: err
            });
        }

        res.status(200).json({
            ok: true,
            hospital: data,
            userToken: req.user,
        });
    });
});

// Update Hospital

app.put('/:id', mdAuthentication.verifyToken, (req, res, next) => {

    const hospitalID = req.params.id;
    const body = req.body;

    Hospital.findById(hospitalID, (err, data) => {


        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'Erro updating user.',
                errors: err
            });
        }

        if (!data) {
            return res.status(400).json({
                ok: false,
                message: `No used was found with ID: ${hospitalID}`,
                errors: err,
            });
        }

        data.name = body.name;
        data.image = body.image;

        data.save((err, dataSaved) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    message: 'Error saving updated hospital',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                hospital: dataSaved,
                userToken: req.user,
            });
        });
    });

});

// Delte Hospital

app.delete('/:id', mdAuthentication.verifyToken, (req, res, next) => {


    const hospitalID = req.params.id;

    Hospital.findByIdAndRemove(hospitalID, (err, data) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                message: `Error deleting user ${ hospitalID }`,
                errors: err,
            });
        }

        if (!data) {
            return res.status(400).json({
                ok: false,
                message: `No user ${ hospitalID }`,
                errors: err
            });
        }

        res.status(200).json({
            ok: true,
            hospital: data,
        });
    })
});

/**
 * Export routes
 */

module.exports = app;