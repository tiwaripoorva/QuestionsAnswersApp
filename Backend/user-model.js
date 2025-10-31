const mongoose = require('mongoose');
 
// Define the schema for the user data
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    // Optional field to track creation time
    createdAt: {
        type: Date,
        default: Date.now
    }
});
 
// IMPORTANT: The third argument ('SignUp') explicitly tells Mongoose to use
// the collection named 'SignUp' instead of the default 'users'.
const User = mongoose.model('User', userSchema, 'SignUp');
 
module.exports = User;
 
 