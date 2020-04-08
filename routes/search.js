/**
 * Requires 
 */

const express = require('express');

/**
 * Initializations
 */

const app = express();

/**
 * Models
 */

const User = require('../models/user');
const Hospital = require('../models/hospital');
const Doctor = require('../models/doctor');

/**
 * Routes 
 */

//General Search

app.get('/all/:search', (req, res, next) => {

    const search = req.params.search;
    const regex = new RegExp(search, 'i');

    Promise.all([
            searchHospitals(search, regex),
            searchDoctors(search, regex),
            searchUsers(search, regex),
        ])
        .then(
            (searchResults) => {
                res.status(200).json({
                    ok: true,
                    hospitals: searchResults[0],
                    doctors: searchResults[1],
                    users: searchResults[2],
                });

            });
});

// Search by collection

app.get('/collection/:collection/:search', (req, res, next) => {

    const collection = req.params.collection;
    const search = req.params.search;
    const regex = new RegExp(search, 'i');
    let promise;

    switch (collection) {
        case 'users':
            promise = searchUsers(search, regex)
            break;
        case 'doctors':
            promise = searchDoctors(search, regex)
            break;
        case 'hospitals':
            promise = searchHospitals(search, regex)
            break;
        default:
            return res.status(400).json({
                ok: false,
                message: 'Valid collections are: users, hospitals and doctors.',
                collection: collection,
                error: { message: 'Invalid collection.' },
            });
    }

    promise.then((data) => {

        res.status(200).json({
            ok: true,
            [collection]: data,
        });


    })

});


/**
 * Functions
 */

const searchHospitals = (search, regex) => {

    return new Promise((resolve, reject) => {

        Hospital.find({ name: regex })
            .populate('user', 'name email')
            .exec((err, hospitals) => {

                if (err) {
                    reject('Error searching Hospitals', err);
                } else {
                    resolve(hospitals);
                }
            });
    });
};

const searchDoctors = (search, regex) => {

    return new Promise((resolve, reject) => {

        Doctor.find({ name: regex })
            .populate('user', 'name email')
            .populate('hospital')
            .exec((err, doctors) => {

                if (err) {
                    reject('Error searching doctors', err);
                } else {
                    resolve(doctors);
                }
            });
    });
};

const searchUsers = (search, regex) => {

    return new Promise((resolve, reject) => {

        User.find({}, 'name email role')
            .or([{ 'name': regex }, { 'email': regex }])
            .exec((err, users) => {
                if (err) {
                    reject('Error searching users', err)
                } else {
                    resolve(users);
                }
            });
    });
};
/**
 * Exports
 */

module.exports = app;