/**
 * Requires
 */

const express = require('express');
const bycrypt = require('bcryptjs');

const mdAuthentication = require('../middlewares/authentication');

/**
 * Models
 */
const User = require('../models/usuario');

/**
 * Initializations
 */

const app = express();

/**
 * User Routes
 */

// Get Users

app.get('/', (req, res, next) => {

    User.find({}, 'nombre email img role').exec((err, data) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'Error getting users',
                errors: err,
            });
        }

        res.status(200).json({
            ok: true,
            message: 'Got all users',
            usuarios: data,
        });

    });

});

// Create Users

app.post('/', mdAuthentication.verifyToken, (req, res, next) => {

    const bodyReq = req.body;
    const user = new User({
        nombre: bodyReq.nombre,
        email: bodyReq.email,
        password: bycrypt.hashSync(bodyReq.password, 10),
        img: bodyReq.img,
        role: bodyReq.role,
    });

    user.save((err, userSaved) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                message: 'Error creating user',
                errors: err,
            });
        }

        userSaved.password = ':)';

        res.status(201).json({
            ok: true,
            message: 'User Created',
            usuario: userSaved,
            userToken: req.user,
        });
    });


});


// Update User

app.put('/:id', mdAuthentication.verifyToken, (req, res) => {

    const userId = req.params.id;
    const body = req.body;

    User.findById(userId, (err, user) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'Error updating user',
                errors: err,
            });
        }

        if (!user) {
            return res.status(400).json({
                ok: false,
                message: 'No user was found with this Id',
                errors: err,
            });
        }

        user.nombre = body.nombre;
        user.email = body.email;
        user.role = body.role;

        user.save((err, userSaved) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    message: 'Error updating user',
                    errors: err,
                });
            }


            userSaved.password = ':)';

            res.status(200).json({
                ok: true,
                message: 'User Update',
                user: userSaved,
            });

        });
    });


});

// Delete User

app.delete('/:id', mdAuthentication.verifyToken, (req, res, next) => {

    const userId = req.params.id;


    User.findByIdAndRemove(userId, (err, deletedUser) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'Error deleting user',
                errors: err,
            });
        };

        if (!deletedUser) {
            return res.status(400).json({
                ok: false,
                message: `No user with id ${userId}`,
                errors: err,
            });
        }

        deletedUser.password = ':)';

        res.status(200).json({
            ok: true,
            message: 'User Deleted',
            user: deletedUser,
        });

    });

});

module.exports = app;