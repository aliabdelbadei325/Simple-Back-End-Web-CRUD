const appError = require("../utils/appError");

module.exports = (...roles)=>{
    console.log(roles)
    return (req,res,next)=>{
    if(!roles.includes(req.currentUser.role)){
        return next(appError.create('the role is not authorized',401))
    }
     
        next();
    }
}
