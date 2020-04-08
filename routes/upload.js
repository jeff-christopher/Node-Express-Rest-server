/**
 * Requires 
 */

const express = require('express');
const fileUpload = require('express-fileupload');
const fileSystem = require('fs');

/**
 * Models
 */

const User = require('../models/user');
const Hospital = require('../models/hospital');
const Doctor = require('../models/doctor');

/**
 * Initializations
 */

const app = express();
const IMG_EXTETENSIONS = ['jpeg', 'jpg', 'gif', 'png'];
const VALID_TYPES = ['users', 'hospitals', 'doctors'];

/**
 * Configurations
 */
app.use(fileUpload());


/**
 * Routes
 */

app.put('/:type/:id', (req, res, next) => {

    const type = req.params.type;
    const id = req.params.id;

    if (VALID_TYPES.indexOf(type) === -1) {
        return res.status(400).json({
            ok: false,
            message: 'Invalid type was sent',
            errors: { message: `Valid types: ${VALID_TYPES.join(',')}` },
        });

    }

    if (!req.files) {
        return res.status(400).json({
            ok: false,
            message: 'You must select a picture.',
            errors: { message: 'No picture was uploaded.' }
        });

    }

    /* Get File name */

    const file = req.files.image;
    const splittedName = file.name.split('.');
    const fileExtension = splittedName[splittedName.length - 1];


    if (IMG_EXTETENSIONS.indexOf(fileExtension) === -1) {
        return res.status(400).json({
            ok: false,
            message: `Valid file extensions: ${ IMG_EXTETENSIONS.join(' , ')}`,
            errors: { message: `Invalid file extension ${fileExtension}` },
        });

    }

    /* Custom Name */
    const fileName = `${id}-${new Date().getMilliseconds()}.${fileExtension}`;

    /* Move file to a specific path */
    const path = `./uploads/${type}/${fileName}`;
    file.mv(path, (err) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'Error moving file.',
                errors: err
            });

        }

        uploadByType(type, id, fileName, res);

    });

});

/**
 * Functions
 */

const uploadByType = (type, id, fileName, res) => {

    let oldPath;

    switch (type) {

        case 'users':

            User.findById(id, (err, userDB) => {

                if (err) {
                    return res.status(400).json({
                        ok: false,
                        message: `No user with ID: ${id}`,
                        errors: err
                    });

                }

                oldPath = `./uploads/users/${userDB.image}`;

                //Deletes old image, if it existed.
                if (fileSystem.existsSync(oldPath)) {
                    fileSystem.unlinkSync(oldPath);
                }

                userDB.image = fileName;

                userDB.save((err, updatedUser) => {

                    if (err) {
                        return res.status(500).json({
                            ok: false,
                            message: 'Error updating user.',
                            errors: err
                        });

                    }

                    updatedUser.password = ':)';

                    return res.status(200).json({
                        ok: true,
                        user: updatedUser,
                    });

                });
            });

            break;

        case 'hospitals':

            Hospital.findById(id, (err, hospitalDB) => {

                if (err) {
                    return res.status(400).json({
                        ok: false,
                        message: `No hospital with ID: ${id}`,
                        errors: err
                    });

                }

                oldPath = `./uploads/hospitals/${hospitalDB.image}`;

                //Deletes old image, if it existed.
                if (fileSystem.existsSync(oldPath)) {
                    fileSystem.unlinkSync(oldPath);
                }

                hospitalDB.image = fileName;

                hospitalDB.save((err, updatedHospital) => {

                    if (err) {
                        return res.status(500).json({
                            ok: false,
                            message: 'Error updating hospital.',
                            errors: err
                        });

                    }

                    return res.status(200).json({
                        ok: true,
                        hospital: updatedHospital,
                    });

                });
            });

            break;

        case 'doctors':
            Doctor.findById(id, (err, doctorDB) => {

                if (err) {
                    return res.status(400).json({
                        ok: false,
                        message: `No user with ID: ${id}`,
                        errors: err
                    });

                }

                oldPath = `./uploads/doctors/${doctorDB.image}`;

                //Deletes old image, if it existed.
                if (fileSystem.existsSync(oldPath)) {
                    fileSystem.unlinkSync(oldPath);
                }

                doctorDB.image = fileName;

                doctorDB.save((err, updatedDoctor) => {

                    if (err) {
                        return res.status(500).json({
                            ok: false,
                            message: 'Error updating doctor.',
                            errors: err
                        });

                    }

                    return res.status(200).json({
                        ok: true,
                        user: updatedDoctor,
                    });

                });
            });
            break;

    }

};

module.exports = app;