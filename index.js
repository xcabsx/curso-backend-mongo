'use strict';

var mongoose = require('mongoose');
var app = require('./app');
var port = process.env.PORT || 3789;
mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost:27017/zoo',{useMongoClient:true})
    .then(( ) => {
        console.log('conexion OK');
        app.listen(port, ()=> {
            console.log('servidor local OK');
        });
    }).catch(err => console.log(err));


