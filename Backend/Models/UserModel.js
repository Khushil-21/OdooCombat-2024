const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address']
    },
    name: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 20
    },
    address: {
        type: String,
    },
    contactNumber: {
        type: String,
        required: true,
        match: [/^\d{10}$/, 'Please enter a valid 10-digit contact number']
    },
    password: {
        type: String,
        required: true
    }
});

const Users = mongoose.models.User || mongoose.model('User', userSchema);

module.exports = Users;
