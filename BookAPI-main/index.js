// const { request, response } = require("express");
require('dotenv').config();
const express = require("express");
const mongoose = require('mongoose');

const port = process.env.PORT || 4000;


//API 
const Book = require('./API/book');
const Author = require('./API/author');
const Publication = require('./API/publication');

mongoose.connect(
    process.env.MONGO_URI,{
        useNewUrlParser: true,
    }

).then(() => console.log("Connection Established!"))
.catch((err) => {
    console.log(err);
});

// initialization
const OurApp = express();

OurApp.use(express.json());

// MicroServices
OurApp.use("/book",Book);
OurApp.use("/author",Author);
OurApp.use("/publication",Publication);

OurApp.listen(port, () => console.log("Server is Running"));