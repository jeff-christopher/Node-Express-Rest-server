/**
 * Requires
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

const Doctor = require('../models/doctor');

/**
 * Routes
 */

// Get Doctor

app.get('/', (req, res, next) => {

    let from = req.params.from || 0;
    from = Number(from);

    Doctor.find({}, (err, data) => {

            if (err) {
                return res.status(500).json({

                    ok: false,
                    message: 'Error getting doctors.',
                    errors: err,

                });
            }

            Doctor.countDocuments({}, (err, count) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        message: 'Error counting records',
                        errors: err
                    });

                }

                res.status(200).json({
                    ok: true,
                    doctor: data,
                    total: count,
                });
            });



        })
        .skip(from)
        .limit(5)
        .populate('user', 'name email')
        .populate('hospital');


});

// Create Doctor

app.post('/', mdAuthentication.verifyToken, (req, res, next) => {


    const body = req.body;

    const newDoctor = new Doctor({

        name: body.name,
        image: body.image,
        hospital: body.hospital,
        user: req.user._id,

    });

    newDoctor.save((err, doctorSaved) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'Error creating doctor',
                errors: err,
            });
        }

        res.status(201).json({
            ok: true,
            doctor: doctorSaved,
            user: req.user,
        });

    });

});

// Update Doctor

app.put('/:id', mdAuthentication.verifyToken, (req, res, next) => {


    const doctorId = req.params.id;
    const body = req.body;


    Doctor.findByIdAndUpdate(doctorId, {
            name: body.name,
            image: body.image,
            hospital: body.hospital,
            user: req.user._id,
        },
        (err, updatedDoctor) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    message: 'Error updating doctor',
                    errors: err
                });

            }

            if (!updatedDoctor) {
                return res.status(400).json({
                    ok: false,
                    message: `No Doctor was found id: ${ doctorId }`
                });
            }

            res.status(200).json({
                ok: true,
                doctor: updatedDoctor,
                user: req.user,
            });

        });


});

// Delete Doctor

app.delete('/:id', mdAuthentication.verifyToken, (req, res, next) => {


    const doctorID = req.params.id;

    Doctor.findByIdAndRemove(doctorID, (err, deletedDoctor) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'Error deleting doctor',
                errors: err,
            });
        }

        if (!deletedDoctor) {
            return res.status(401).json({
                ok: false,
                message: `No doctor was found ${ doctorID }`,
            });
        }

        res.status(200).json({
            ok: true,
            doctor: deletedDoctor,
            user: req.user,
        });

    })


});

/**
 * Export rotues
 */

module.exports = app;