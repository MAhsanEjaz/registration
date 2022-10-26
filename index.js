const express = require('express');

const mongoose = require('mongoose');

const bodyparser = require('body-parser');

const Routes = require('./routes/routes.js');

const app = express();
app.use(express.json());
app.use(bodyparser.json());

app.use(express.static('uploads'));



mongoose.connect(process.env.DATABASE || "mongodb+srv://pidian:pidian12345@cluster0.ugrkszb.mongodb.net/?retryWrites=true&w=majority", (err)=>{
    if(!err){
        console.log('Database connected');
    }else{
        console.log('Database not connected');
    }
})
app.use('/routes',Routes );

const PORT = process.env.PORT || 8000 

    console.log(PORT);




app.listen(PORT);