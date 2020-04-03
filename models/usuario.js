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

const usuarioSchema = new Schema({

    nombre: { type: String, required: [true, 'Name is required'], unique: false },
    email: { type: String, required: [true, 'Email is required'], unique: true },
    password: { type: String, required: [true, 'Password is required'], unique: false },
    img: { type: String, required: false },
    role: { type: String, required: true, uppercase: true, default: 'USER_ROLE', enum: validRoles },

});

usuarioSchema.plugin(uniqueValidator, { message: '{PATH} must be unique' });

module.exports = mongoose.model('Usuario', usuarioSchema);