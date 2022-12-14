const router = require('express').Router()
const {User, validate } =require("../models/user")
const bcrypt = require('bcrypt')

router.post("/", async(req, res) =>{
    try{
        const{error} = validate(req.body);
        if(error)
        return res.status(400).send({ message: error.details[0].message})

        const user= await User.findOne({ email:req.body.email})
        if(user)
          return res.status(409).send({ message: "user already exists"})
        
          const salt= await bcrypt.genSalt(Number(process.env.SALT))
          const hashPassword = await bcrypt.hash(req.body.password, salt)

          await new User({...req.body, password:hashPassword}).save()
          res.status(201).send({ message:"user created successfully"})
    }catch(error){
        res.status(500).send({message:"internal server error"})
    }
})
//add checkAuth sfter id
router.get('/id:',(req, res) =>{
    User.findOne({ _id: req.param.id}).then(user =>{
        res.json({ user, success:true})
    }).catch(er =>{
        res.json({ success: false, message:er.message})
    })
})
module.exports = router