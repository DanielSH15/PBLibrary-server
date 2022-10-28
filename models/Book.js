const mongoose = require('mongoose')
require('dotenv').config()



const BookSchema = new mongoose.Schema({
    name: {type: String, required: true, unique: true},
    author: {type: String},
    rating: {type: String}
})



const BookModel = mongoose.model('books', BookSchema)

module.exports = {
    BookModel
}