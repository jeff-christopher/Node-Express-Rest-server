/**
 * Requires
 */

const express = require('express');
const bycrypt = require('bcryptjs');
const mdAuthentication = require('../middlewares/authentication');


/**
 * Initializations
 */

const app = express();

/**
 * Models
 */

const User = require('../models/user');

/**
 * User Routes
 */

// Get Users

app.get('/', (req, res, next) => {

    let from = req.query.from || 0;
    from = Number(from);


    User.find({}, 'name email image role google')
        .limit(5)
        .skip(from)
        .exec((err, data) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    message: 'Error getting users',
                    errors: err,
                });
            }

            User.countDocuments({}, (err, count) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        message: 'Error counting records',
                        errors: err
                    });

                }

                res.status(200).json({
                    ok: true,
                    users: data,
                    total: count,
                });

            });

        });

});

// Create Users

app.post('/', mdAuthentication.verifyToken, (req, res, next) => {

    const bodyReq = req.body;
    const user = new User({
        name: bodyReq.name,
        email: bodyReq.email,
        password: bycrypt.hashSync(bodyReq.password, 10),
        image: bodyReq.image,
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
            user: userSaved,
            userToken: req.user,
        });
    });


});


// Update User

app.put('/:id', mdAuthentication.verifyToken, (req, res) => {

    const userID = req.params.id;
    const body = req.body;

    User.findById(userID, (err, user) => {

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
                message: `No user was found with this Id: ${ userID }`,
                errors: err,
            });
        }

        user.name = body.name;
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

    const userID = req.params.id;


    User.findByIdAndRemove(userID, (err, deletedUser) => {

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
                message: `No user with id ${userID}`,
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

/**
 * Export routes
 */

module.exports = app;