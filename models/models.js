const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
require('dotenv').config()

const UserSchema = new mongoose.Schema({
    username: {type: String, required: true, unique: true},
    firstName: {type: String},
    lastName: {type: String},
    email: {type: String, unique: true},
    password: {type: String},
    phone: {type: String},
    age: {type: Number},
    genre: {type: String},
    gender: {type: String},
    accessKey: {type: Number, default: 1},
    lastLoginDate: {type: Date}
})



const UserModel = mongoose.model('users', UserSchema)



module.exports = {
    UserModel
}