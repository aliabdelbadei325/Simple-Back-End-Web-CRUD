const asyancWrapper = require('../middelwaer/asyancWrapper');
const user = require('../models/user.model');
const httpStatusText = require('../utils/httpStatusText');
const appError = require('../utils/appError');
const bycrypt = require("bcryptjs")
const jwt = require('jsonwebtoken');
const generateJWt = require('../utils/generateJWt');

const getAllUsers =asyancWrapper(
    async (req, res) => {
     // console.log(req.headers);
       const query = req.query;
       
       const limit = query.limit||10;
       const page = query.page||1;
       const skip = (page - 1) * limit;
       const users = await user.find({},{"__v":false,'password':false}).limit(limit).skip(skip);
       res.json({status:httpStatusText.SUCCESS, data:{users}});
   })

const register =asyancWrapper(async(req,res,next)=>{
    const {firstName,lastName,email,password,role} = req.body;
    console.log("req.file",req.file);
  const olduser = await user.findOne({email:email});
  if(olduser){
   const error = appError.create('user already exist',404,httpStatusText.FAIL)
          return next(error)
  }
 const hashedpassword = await bycrypt.hash(password,10)

  const newUser = new user({
        firstName,
        lastName,
        email,
        password:hashedpassword,
        role,
        avatar: req.file.filename
    })
   const token = await generateJWt({email:newUser.email,id:newUser._id,role:newUser.role})
    newUser.token = token;

    await newUser.save();
    
    res.status(201).json({status:httpStatusText.SUCCESS, data:{newUser}});
});

const login = asyancWrapper(async(req,res,next)=> {
   const {email,password} = req.body 
   if(!email && !password){
    const error = appError.create('email and passwrd are requierd',404,httpStatusText.FAIL);
    return next(error);
   }
 const User = await user.findOne({email:email});
 if(!User){
    const error = appError.create('user not found',400,httpStatusText.FAIL)
    return next(error)
 }
 const matchedpassword = await bycrypt.compare(password,User.password);

 if(User && matchedpassword){
   const token = await generateJWt({email:User.email,id:User._id,role:User.role})
    res.status(201).json({status:httpStatusText.SUCCESS, data:{token:token}});
 }else{
    const error = appError.create('smoe thing wrong',500,httpStatusText.FAIL);
    return next(error);
 }
})

module.exports = {
    getAllUsers,
    register,
    login
}