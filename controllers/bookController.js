require('dotenv').config()
const {BookModel} = require('../models/Book')


class bookController{
    async createBook(req, res){
        try{
            const {name, author} = req.body
            const book = new BookModel({name: name, author: author})
            await book.save()
            return res.status(200).send({book})
 
        } catch (e){

        }
    }
}

module.exports = new bookController()