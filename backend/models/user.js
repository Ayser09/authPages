const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const Joi = require('joi')
const passwordComplexity = require('joi-password-complexity')

const userSchema = new mongoose.Schema({
    firstname:{
        type: String, required:true
    },
    lastname:{
        type: String, required:true
    },
    email:{
        type: String, required:true
    },
    password:{
        type: String, required:true
    }
})
userSchema.methods.generateAuthToken = function(){
    const token =jwt.sign({_id: this._id}, process.env.JWTPRIVATEKEY, {expiresIn:"10d"})
    return token
}
const User = mongoose.model("user", userSchema)

const validate = (data) =>{
    const schema = Joi.object({
        firstname:Joi.string().required().label('firstname'),
        lastname:Joi.string().required().label('lastname'),
        email:Joi.string().email().required().label('email'),
        password:passwordComplexity().required().label('password')
    })
    return schema.validate(data)
}

module.exports = { User, validate}