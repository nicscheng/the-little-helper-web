const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    avatar: {
        type: String,
        //required: true
    },

    email: {
        type: String,
        required: true
    },

    bio: {
        type: String
    }

}, {timestamps: true});

const User = mongoose.model('User', userSchema);

module.exports = User;
