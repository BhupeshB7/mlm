
const express = require('express');
const User = require('../models/User')
const router = express.Router();
const bcrypt = require('bcrypt')
const nodemailer = require("nodemailer");
const jwt  = require("jsonwebtoken");


// email config

const transporter = nodemailer.createTransport({
    service:"gmail",
    auth:{
        user:process.env.EMAIL,
        pass:process.env.PASSWORD
    }
}) 

// send email Link For reset Password
router.post("/sendpasswordlink",async(req,res)=>{
    // console.log(req.body)

    const {email} = req.body;

    if(!email){
        res.status(401).json({status:401,message:"Enter Your Email"})
    }

    try {
        const userfind = await User.findOne({email: email});

        // token generate for reset password
        const token = jwt.sign({_id:userfind._id},process.env.JWT_SECRET,{
            expiresIn:"300s"

        });
        // console.log("token", token);
        const setusertoken = await User.findByIdAndUpdate({_id:userfind._id},{verifytoken:token},{new:true});


        if(setusertoken){
            const mailOptions = {
                from:process.env.EMAIL,
                to:email,
                subject:"Sending Email For password Reset",
                // html:`<h2>hi... ${userfind.name}</h2>`,
                html:`<h2>hi... ${userfind.name}</h2>  \n This Link Valid For 5 MINUTES https://www.powerfullindia.com/forgotpassword/${userfind.id}/${setusertoken.verifytoken}`
            }

            transporter.sendMail(mailOptions,(error,info)=>{
                if(error){
                    // console.log("error",error);
                    res.status(401).json({status:401,message:"email not send"})
                }else{
                    // console.log("Email sent",info.response);
                    res.status(201).json({status:201,message:"Email sent Succsfully"})
                }
            })

        }

    } catch (error) {
        res.status(401).json({status:401,message:"invalid user"})
        // console.log(error)
    }

});


// verify user for forgot password time
router.get("/forgotpassword/:id/:token",async(req,res)=>{
    const {id,token} = req.params;

    try {
        const validuser = await User.findOne({_id:id,verifytoken:token});
        
        const verifyToken = jwt.verify(token,process.env.JWT_SECRET);

        // console.log(verifyToken)

        if(validuser && verifyToken._id){
            res.status(201).json({status:201,validuser})
        }else{
            res.status(401).json({status:401,message:"user not exist"})
        }

    } catch (error) {
        res.status(401).json({status:401,error})
    }
});


// change password

router.post("/:id/:token",async(req,res)=>{
    const {id,token} = req.params;

    const {password} = req.body;
// console.log(password);
    try {
        const validuser = await User.findOne({_id:id,verifytoken:token});
        
        const verifyToken = jwt.verify(token,process.env.JWT_SECRET);

        if(validuser && verifyToken._id){
            const newpassword = await bcrypt.hash(password,12);

            const setnewuserpass = await User.findByIdAndUpdate({_id:id},{password:newpassword});

            setnewuserpass.save();
            res.status(201).json({status:201,setnewuserpass})

        }else{
            res.status(401).json({status:401,message:"user not exist"})
        }
    } catch (error) {
        res.status(401).json({status:401,error})
        // console.log(error);
    }
})

module.exports = router;
