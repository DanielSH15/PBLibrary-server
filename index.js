require('dotenv').config()
const path = require('path')
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const { registration, login, update, read, auth, findAll, deleteUser} = require('./controllers/userController')

//DB CONNECTION
const db = process.env.MONGO_URI || 'mongodb+srv://Daniel:Psw123@cluster0.bffzqgt.mongodb.net/Database1'
mongoose.connect(db)

const app = express()

app.use(cors())
app.use(express.json())

app.post('/registration', registration)
app.post('/login', login)
app.put('/update/:_id', update)
app.get('/read', auth, read)
app.get('/readall', findAll)
app.delete('/delete/:_id', deleteUser)


const PORT = process.env.PORT || 8000

app.listen(PORT, () => {console.log(`App has started on port ${PORT}`)})