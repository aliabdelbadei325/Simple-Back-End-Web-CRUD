
require('dotenv').config();
const express = require('express');
const path = require('path'); 
const app = express()

const cors = require('cors');
app.use('/uploads',express.static(path.join(__dirname,'uploads')));
const mongoose = require('mongoose');
const httpStatusText = require('./utils/httpStatusText');
const { body, validationResult } = require('express-validator');
//console.log(process.env)

const username = encodeURIComponent(process.env.MONGO_USERNAME);
const password = encodeURIComponent(process.env.MONGO_PASSWORD);
const cluster = process.env.MONGO_CLUSTER;
const dbName = process.env.MONGO_DBNAME;

const url = `mongodb+srv://${username}:${password}@${cluster}/${dbName}?retryWrites=true&w=majority`;

mongoose.connect(url).then(() => {
    console.log('MongoDB connected');
}).catch((err) => {
    console.error('Error connecting to MongoDB', err);
});
app.use(cors())
app.use(express.json());

const coursesController = require('./contraoll/controall');
const courseroute = require('./routes/courses.route');
const userroute = require('./routes/user.route');
app.use('/api/courses',courseroute)
app.use('/api/users',userroute)
// gllobal middelware for not foundc router
app.all('*', (req, res, next) => {
    res.status(404).json({ status: "error", message: "This resource is not available" });
});
//global error handler
app.use((error, req, res, next) => {
    const statusCode = error.statusCode || 500;
    const statusText = error.httpStatusText || httpStatusText.ERROR;
    
    res.status(statusCode).json({
        status: statusText,
        message: error.message || "Internal Server Error",
        code: statusCode
    });
});

app.listen(4000, () => {
    console.log('Server running on port 4000');
});
