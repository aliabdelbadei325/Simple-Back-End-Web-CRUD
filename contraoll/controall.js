const  {validationResult} = require('express-validator');
const Course = require('../models/courses.models');
 const httpStatusText = require('../utils/httpStatusText');
const asyancWrapper = require('../middelwaer/asyancWrapper');
const appError = require('../utils/appError');
const getAllCourses =asyancWrapper(
 async (req, res) => {
    const query = req.query;
    
    const limit = query.limit||10;
    const page = query.page||1;
    const skip = (page - 1) * limit;
    const courses = await Course.find({},{"__v":false,}).limit(limit).skip(skip);
    res.json({status:httpStatusText.SUCCESS, data:{courses}});
});

const getCourse = asyancWrapper(
async (req, res) => {
   const course = await Course.findById(req.params.courseId,{"__v":false});
    if (!course) {
       
      const error = appError.create('not found course',404,httpStatusText)
       return next(error)
        //return res.status(404).json({ status:httpStatusText.FAIL, data:{course:"course not found"}});
    }
    res.json({status:httpStatusText.SUCCESS, data:{course}});
    
        res.json({status:httpStatusText.ERROR, data:null,message:err.message,code:400});
    }
);

const addCourse = asyancWrapper(
async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = appError.create(errors.array(),400,httpStatusText.FAIL);
      return next(error);
        
    }

        const newCourse = new Course(req.body);
        await newCourse.save();
        res.status(201).json({status:httpStatusText.SUCCESS, data:{newCourse}});
  
})

const updateCourse = asyancWrapper(
async (req, res) => {
    const courseId = req.params.courseId;
    
        const updatedCourse = await Course.findByIdAndUpdate(courseId, { $set: { ...req.body } }, { new: true });
        if (!updatedCourse) {
            return res.status(404).json({ msg: "Course not found" });
        }
        res.status(200).json({status:httpStatusText.SUCCESS, data:{updatedCourse}});
    

})

const deleteCourse = asyancWrapper(
async (req, res) => {
    const courseId = req.params.courseId;
    
        const deletedCourse = await Course.findByIdAndDelete(courseId);
        if (!deletedCourse) {
            return res.status(404).json({ msg: "Course not found" });
        }
        res.status(200).json({ status:httpStatusText.SUCCESS, deletedCourse:null });
   
});

module.exports = {
    getAllCourses,
    getCourse,
    addCourse,
    updateCourse,
    deleteCourse
};
