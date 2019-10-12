const mongoose = require('mongoose');
const connection = require('../connection');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    verified: {
        type: Boolean,
        required: true,
        default: false
    }
});

const User = mongoose.model('User', UserSchema);

module.exports = User;