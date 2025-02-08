const express = require('express');
const multer  = require('multer');
const diskStorage = multer.diskStorage({
    destination: function (req,file,cb){
        console.log("File",file);
        cb(null,'uploads')
    },
    filename: function (req,file,cb){
        const ext = file.mimetype.split('/')[1]
        const fileName = `user-${Date.now()}.${ext}`;
        cb(null,fileName);
    }
})
const fileFilter = (req,file,cb)=>{
    const imageType = file.mimetype.split('/')[0]
    if(imageType=='image'){
      return  cb(null,true)
    }else{
        return cb(appError.create('this file not image',400),false);
    }
}
const upload = multer({ storage: diskStorage ,fileFilter})

const router = express.Router();
const userController = require('../contraoll/user.controller');
const verifyToken =  require('../middelwaer/verfiyToken');
const appError = require('../utils/appError');
router.route('/')

        .get(verifyToken,userController.getAllUsers)

router.route('/register')

    .post(upload.single('avatar'),userController.register);

router.route('/login')

   .post(userController.login);

module.exports = router;