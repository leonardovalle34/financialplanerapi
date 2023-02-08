const express = require("express")
var router = express.Router()
const User = require("../models/user")
const jwt = require("jsonwebtoken")
require("dotenv").config()
const secret = process.env.JWT_TOKEN
const WithAuth = require("../middlewares/auth")


router.post("/register", async(req, res)=>{
    const {name , email, password} = req.body
    const user = new User({name,email,password})
    const token = jwt.sign({email},secret, {expiresIn: "10d"})
    try{
        await user.save();
        res.status(200).json({"user" : user , token})
    }catch (error){
        console.log(error)
        res.status(500).json({error: "Erro ao registrar usuário"})
    }
})
router.post("/login", async(req,res)=>{
    const { email, password } = req.body

    try{
        let user = await User.findOne({ email })
        if(!user){
            res.status(401).json({error:"Usuário ou senha incorretos"})
        }else{
            user.isCorrectPassword(password, function(err, same){
                if(!same){
                    res.status(401).json({error:"Usuário ou senha incorretos"})
                }else{
                    const token = jwt.sign({email},secret, {expiresIn: "10d"})
                    res.json({user: user, token: token})
                }
            })
        }
    }catch(err){
        res.status(500).json({error:"internal error"})
    }
})

router.put("/loginupdate", WithAuth , async(req,res)=>{
    const {name , email } = req.body
    try{
        let user = await User.findOneAndUpdate(
            {_id : req.user._id},
            {$set:{name: name , email : email}},
            {upsert: true , "new" : true}
        )
        res.json(user).status(201)
    }catch(err){
        
        res.json(err).status(400)
    }
})

router.put("/password", WithAuth , async(req,res)=>{
    const {password} = req.body

    try{
        let user = await User.findOne({_id : req.user._id})
        user.password = password;
        user.save();
        res.json(user).status(200)
    }catch(err){
        res.json({err:err}).status(401)
    }
})

router.delete("/loginupdate" , WithAuth , async(req,res)=>{
    
    try{
        let user = await User.findOne({_id: req.user._id})
        await user.delete()
        res.json("User deleted").status(200)
    }catch(err){
        res.json({err:err}).status(400)
    }
})

module.exports = router