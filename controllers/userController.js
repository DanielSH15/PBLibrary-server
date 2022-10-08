require('dotenv').config()
const {UserModel} = require('../models/models')


const jwt = require('jsonwebtoken')

class userController{
    async registration (req, res){
        
        try{
            const {username, firstName, lastName, email, password, phone, age, genre, gender} = req.body
            const candidateUsername = await UserModel.findOne({username: req.body.username})
            const cancdidateEmail = await UserModel.findOne({email: req.body.email})
            const candidatePhone = await UserModel.findOne({phone: req.body.phone})
            
            if(candidateUsername){
                return res.status(400).send({message: "This user already exists!"})
            }
            if(cancdidateEmail){
                return res.status(400).send({message: "This email already exists!"})
            }
            if(candidatePhone){
                return res.status(400).send({message: "This phone already exists!"})
            }

            const user = new UserModel({username: username, firstName: firstName, lastName: lastName, email: email, password: password, phone:phone, age:age, genre: genre, gender: gender, accessKey: 1})
            await user.save()
            const token = jwt.sign({username: user.username, 
                firstName: user.firstName, 
                lastName: user.lastName, 
                email: user.email, 
                password: user.password, 
                phone: user.phone, 
                age: user.age, 
                genre: user.genre, 
                gender: user.gender, 
                accessKey: 1}, process.env.SECRET_KEY, {expiresIn: '2h'})
            return res.send({token})
        } catch (e) {
            
        }
    }

    async login(req, res){
        const {username, password} = req.body
  
        try{
          const user = await UserModel.findOne({username: req.body.username})

          if(!user){
            return res.status(401).send({message: "Invalid username or password!"})
          }
          if(req.body.password != user.password){
            return res.status(401).send({message: "Invalid username or password!"})
          }
          const token = jwt.sign({id: user._id,
            username: user.username, 
            firstName: user.firstName, 
            lastName: user.lastName, 
            email: user.email, 
            password: user.password, 
            phone: user.phone, 
            age: user.age, 
            genre: user.genre, 
            gender: user.gender, 
            accessKey: user.accessKey}, process.env.SECRET_KEY, {expiresIn: '2h'})
          if(user.accessKey == 5){
            return res.status(200).send({token, message: "admin"})
          }
          return res.status(200).send({token, message: "user"})
        } catch (e){
          res.status(500).send({message: "Internal server error"})
        }
    }

    async update(req, res){
      try{
        const id = req.params._id
        const {firstName, lastName, username, email, password, phone, age, genre, gender} = req.body
        const options = {new: true}

        const candidateUsername = await UserModel.findOne({username: req.body.username})
        const candidateEmail = await UserModel.findOne({email: req.body.email})
        const candidatePhone = await UserModel.findOne({phone: req.body.phone})

        if(candidateUsername && candidateUsername._id != id){
          return res.status(400).send({message: "This user already exists!"})
        } 
        if(candidateEmail && candidateEmail._id != id){
          return res.status(400).send({message: "This email already exists"})
        }
        if(candidatePhone && candidatePhone._id != id){
          return res.status(400).send({message: "This phone already exists"})
        }

        const user = await UserModel.findOne({_id: id})
        const token = jwt.sign({id: user._id,
          username: username, 
          firstName: firstName, 
          lastName: lastName, 
          email: email, 
          password: password, 
          phone: phone, 
          age: age, 
          genre: genre, 
          gender: gender, 
          accessKey: user.accessKey}, process.env.SECRET_KEY, {expiresIn: '2h'})
        
         UserModel.findByIdAndUpdate(id, req.body, {new: true}, (error, data) => {
          if(error){
            return res.status(400).send({message: error.data})
          } else {
            return res.status(200).send({token, message: data})
          }
        })

        
      } catch (e){
        res.status(400).send({message: 'Error'})
      }
    }


    async auth (req, res, next){
      const authHeader = req.headers['authorization']
      const token = authHeader && authHeader.split(' ')[1]

      if(token == null){
        return res.status(401).send({message: 'Not authorized', token: {token}})
      }

      jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
        if(err){
          return res.status(403).send({message: "No access"})
        }
        req.user = user
        next()
      })
    }

    async read (req, res){
      res.status(200).send(req.user)
    }

    async findAll(req, res){
      UserModel.find({}, (err, result) => {
        if(err){
          res.status(400).send(err)
        } else {
          res.status(200).send(result)
        }
      })
    }

    async deleteUser(req, res){
      UserModel.findByIdAndDelete({_id: req.params._id}).then(doc => res.status(200).send({message: "Deleted"})).catch((err) => console.log(err))
    }

    


}


module.exports = new userController()