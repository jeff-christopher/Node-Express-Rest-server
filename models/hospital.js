/**
 * Requires
 */

const moongoose = require('mongoose');
const Schema = moongoose.Schema;


/**
 * Schema
 */

const hospitalSchema = new Schema({

    name: { type: String, required: [true, 'Name is required.'] },
    image: { type: String, required: false },
    user: { type: Schema.Types.ObjectId, ref: 'User' },

}, { collection: 'hospitals' });


/**
 * Exports
 */

module.exports = moongoose.model('Hospital', hospitalSchema);