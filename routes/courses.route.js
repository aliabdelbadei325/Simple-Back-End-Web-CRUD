const express = require('express');
const routes = express.Router();
const courseController = require('../contraoll/controall');
const {validationSchema} = require('../middelwaer/validationSchema');
const verifyToken =  require('../middelwaer/verfiyToken');
const userRole = require('../utils/roles');
const allowedTo = require('../middelwaer/allowedTo');
routes.route('/')
.get(courseController.getAllCourses)
.post(verifyToken,allowedTo(userRole.MANGER),validationSchema(),courseController.addCourse);
routes.route('/:courseId')
.get(courseController.getCourse)
.patch(courseController.updateCourse)
.delete(verifyToken,allowedTo(userRole.ADMIN,userRole.MANGER),courseController.deleteCourse);
module.exports = routes;