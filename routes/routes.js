const express = require('express');
const registration = require('../model/registration');

const bcrypt = require('bcrypt');
const jsonwebtoken = require('jsonwebtoken');
const cors = require('cors');


const app = express.Router();



class UserController{
    static Regitartion = async (req, res)=>{
        const { name, email, password, password_confirmation, tc } = req.body
    const user = await registration.findOne({email: email})
    if(user){
            res.send({"status": "failed", "message": "Email already exists"})
        }else{
            if(name && email && password && password_confirmation && tc){
                if (password === password_confirmation){
                    try{
                        const salt = await bcrypt.genSalt(10)
                        const hashPassword = await bcrypt.hash(password, salt)
                        const docs = new registration({           
                            name: name,
                            email: email,
                            password: hashPassword,
                            tc: tc
                        })
                        docs.save()
                        const saveUser = await registration.findOne({email: email})

              const token = jsonwebtoken.sign({ userID: saveUser._id }, "dhsjf3423jhsdf3423df", { expiresIn: '5d' })

              res.status(201).send
              ({ "status": "success", "message": "Registration Success", 
              "token": token, "password": password })
                }catch(err){
                        console.log(err)
                        res.send({ "status": "failed", "message": "Unable to Register" })
                    }
                 }else{
                    res.send({"message": "Password not match"});
                }
             }else{
                res.send({"massage": "All fields are requird"})
            }
        }
    }

    static userRegistration = async (req, res) => {
        const { name, email, password, password_confirmation, tc } = req.body
        const user = await registration.findOne({ email: email })
        if (user) {
          res.send({ "status": "failed", "message": "Email already exists" })
        } else {
          if (name && email && password && password_confirmation && tc) {
            if (password === password_confirmation) {
              try {
                const salt = await bcrypt.genSalt(10)
                const hashPassword = await bcrypt.hash(password, salt)
                const doc = new registration({
                  name: name,
                  email: email,
                  password: hashPassword,
                  tc: tc
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



}


app.post('/registration',UserController.userRegistration)


module.exports = app;