/**
 * Requires
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * Schema
 */
const doctorSchema = new Schema({

    name: { type: String, required: [true, 'Name is required'] },
    image: { type: String, required: [false] },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: [true] },
    hospital: { type: Schema.Types.ObjectId, ref: 'Hospital', required: [true, 'Hospita ID is required'] },

});

/**
 * Exports
 */

module.exports = mongoose.model('Doctor', doctorSchema);