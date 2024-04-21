const mongoose = require('mongoose');
const Schema = mongoose.Schema;

module.exports = new Schema({
    username: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    updatedAt: {
        type: Date,
        default: Date.now
    } 
}, { collection : 'passwordSpr2024' });
