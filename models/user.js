/**
 * Requires
 */

const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;

const validRoles = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} invalid role',
};

/**
 * Schema
 */

const userSchema = new Schema({

    name: { type: String, required: [true, 'Name is required'], unique: false },
    email: { type: String, required: [true, 'Email is required'], unique: true },
    password: { type: String, required: [true, 'Password is required'], unique: false },
    image: { type: String, required: false },
    role: { type: String, required: true, uppercase: true, default: 'USER_ROLE', enum: validRoles },
    google: { type: Boolean, default: false },

});

userSchema.plugin(uniqueValidator, { message: '{PATH} must be unique' });


/**
 * Exports
 */

module.exports = mongoose.model('User', userSchema);