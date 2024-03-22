var jwt = require('jsonwebtoken');
const UserModel = require("../models/UsersModel");
const OtpModel = require('../models/OtpModel');
const SendEmailUtility = require('../utility/SendEmailUtility');

// Registration Start
exports.Registration = async (req, res) => {
  try {
    const reqBody = req.body
    const user = await UserModel.create(reqBody);
    res.status(200).json({status: "success", data: user});

  }
   catch (error) {
    res.status(200).json({status: "fail", data: error});
  }
};
// Registration End

// Login Start
exports.Login = async (req, res) => {
  try {
    const reqBody = req.body

    let user = await UserModel.findOne({email: reqBody.email});

    if(!user) {
      res.status(200).json({status: "fail", data: "User not found"});
    }
    if(user.password !== reqBody.password) {
      res.status(200).json({status: "fail", data: "Wrong password"});
    }

    else {
      let payload = {exp: Math.floor(Date.now() / 1000) + (60 * 60), data: user['email']} // 1 hour
      let token = jwt.sign(payload, process.env.JWT_SECRET);
      res.status(200).json({status: "success", data: user, token: token});
    }
  }
  catch (error) {
    res.status(200).json({status: "fail", data: error});
  }
};
// Login End

// Profile Update Start
exports.ProfileUpdate = async (req, res) => {
  try{
    let email = req.headers.email
    let body = req.body
    let query = {email: email}
    let user = await UserModel.updateOne(query, body);
    res.status(200).json({status: "success", data: user});
  }
  
  catch (error) {
    res.status(200).json({status: "fail", data: error});
  }
  
};
// Profile Update end


// Profile Details Start
exports.ProfileDetails = async (req, res) => {
  try{
    let email = req.headers.email
    let user = await UserModel.findOne({email: email});
    res.status(200).json({status: "success", data: user});
  }
  
  catch (error) {
    res.status(200).json({status: "fail", data: error});
  }
  
};
// Profile Details End

// Reover and verify send email otp start

exports.RecoverVerifyEmail= async (req, res) => {
  let email = req.params.email
  let otp = Math.floor(Math.random() * 1000000) // 6 digit otp

  try{
    let user = await UserModel.findOne({email:email})
    if(!user){
      return res.status(200).json(({ status: "fail", data: "User not found" })); 
    }

    else{
      
      // 1 send email database
       let createOtp = await OtpModel.create({email:email, otp:otp})
      // 2 send otp email 
      let sendEmail = SendEmailUtility( email, `Your OTP is ${otp}`, "To-Do-Planner Password Verification" ) 
      
      return res.status(200).json(({ status: "success", data: "OTP sent successfully"}));
    }
  }
  
  catch (error) {
    res.status(200).json({status: "fail", data: error});
  }
  
};
// Reover and verify send email otp end


// verify otp stat
exports.OtpVerify = async (req, res) => {

    let email = req.params.email
    let otp = req.params.otp
    let status = 0
    let updateStatus = 1

  try{
    let otpCheck = await OtpModel.aggregate(
      [
        {$match:{email:email, otp:otp, status:status}},
        {$count: "total"}
      ]
    )

    if(otpCheck.length>0){
        let otpUpdate = await OtpModel.updateOne({email:email, otp:otp}, {status:updateStatus})
        return res.status(200).json(({ status: "success", data: otpUpdate}));
    }
    else{
      return res.status(200).json(({ status: "fail", data: "Invalid OTP" })); 
    }
  }
  catch (error) {
    res.status(200).json({status: "fail", data: error});
  }
}
// verify otp end


// reset Password start
exports.ResetPassword = async (req, res) => {
    let email = req.body.email
    let otp = req.body.otp
    let updateStatus = 1
    let newPassword = req.body.password

  try{
  
    let otpCheck = await OtpModel.aggregate(
      [
        {$match:{email:email, otp:otp, status:updateStatus}},
        {$count: "total"}
      ]
    )

    if(otpCheck.length>0){
      let updatePassword = await UserModel.updateOne({email:email}, {password:newPassword})
      return res.status(200).json(({ status: "success", data: updatePassword}));
  }

  else{
    return res.status(200).json(({ status: "fail", data: "Invalid OTP" })); 
  }

  }

  catch (error) {
    res.status(200).json({status: "fail", data: error});
  }
}


// reset Password end

