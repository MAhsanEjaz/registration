const express = require('express');
const registration = require('../model/registration');
const bcrypt = require('bcrypt');
const jsonwebtoken = require('jsonwebtoken');
const cors = require('cors');
const app = express.Router();



app.use(express.static('./uploads/'));

const multer = require('multer');



const storage = multer.diskStorage({

  destination: function(req, file, cb){
    cb(null, './uploads/')
  },
  filename: function(req, file, cb){
    cb(null, Date.now() +  file.originalname)
  }

})

const upload = multer({
  storage: storage
}).single('upload');


app.post('', upload, (req, res)=>{
  res.json({"image":"image successful updated"});
})


class UserController{  
    static userRegistration = async (req, res) => {
             const { name, email,   password, password_confirmation } = req.body
        const user = await registration.findOne({ email: email })
        if (user) {
          res.send({ "status": "failed", "message": "Email already exists" })
        } else {

          
          if (name && email && password && password_confirmation ) {
            if (password === password_confirmation) {
              try {                   
                const salt = await bcrypt.genSalt(10)            
                const hashPassword = await bcrypt.hash(password, salt)
                const doc = new registration({
                  name: name,
                  email: email,
                  password: hashPassword,
              
                  // tc: tc
                })
                await doc.save()
                const saved_user = await registration.findOne({ email: email })
                // Generate JWT Token
                const token = jsonwebtoken.sign({ userID: saved_user._id },"dhsjf3423jhsdf3423df", { expiresIn: '5d' })
                res.status(201).send({ "status": "success", "message": "Registration Success", "token": token, "password": password,"name": name })
              } catch (error) {
                console.log(error)
                res.send({ "status": "failed", "message": "Unable to Register" })
              }
            } else {
              res.send({ "status": "failed", "message": "Password and Confirm Password doesn't match" })
            }
          } else {
            res.send({ "status": "failed", "message": "All fields are required" })
          }
        }
      }

      static userLogin = async (req, res) => {
        try {
          const { email, password } = req.body
          if (email && password) {
          
          

            const user = await registration.findOne({ email: email })
            if (user != null) {
              const isMatch = await bcrypt.compare(password, user.password)
              if ((user.email === email) && isMatch) {
                // Generate JWT Token
                const token = jsonwebtoken.sign({ userID: user._id }, "dhsjf3423jhsdf3423df", { expiresIn: '5d' })
                res.send({"status": "success", "message": "Login Success", "token": token, "email": email })
              } else {
                res.send({ "status": "failed", "message": "Email or Password is not Valid" })
              }
            } else {
              res.send({ "status": "failed", "message": "You are not a Registered User" })
            }
          } else {
            res.send({ "status": "failed", "message": "All Fields are Required" })
          }
        } catch (error) {
          console.log(error)
          res.send({ "status": "failed", "message": "Unable to Login" })
        }
      }
}


app.post('/registration',UserController.userRegistration)
app.post('/login',UserController.userLogin)


module.exports = app;