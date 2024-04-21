const mongoose = require('mongoose');
const Schema = mongoose.Schema;

module.exports = new Schema({
    receiver: {
        type: String,
        required: true
    },
    sender: {
        type: String,
        required: true
    },
    accepted: {
        type: Boolean,
        required: true
    }
}, { collection : 'messageSpr2024' });
