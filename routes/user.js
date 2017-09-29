'use strict'

var express = require('express');
var UserController = require('../controllers/user');

var md_auth = require('../middlewares/authenticate');
var multipart = require('connect-multiparty');
var md_upload = multipart({ uploadDir: './uploads/users'});

var api = express.Router();

api.get('/pruebascontrolador', md_auth.ensureAuth, UserController.pruebas);
api.post('/saveUser', UserController.saveUser);
api.post('/login', UserController.login);
api.post('/upload-image-user/:id', [md_auth.ensureAuth, md_upload] , UserController.uploadImage);
api.put('/update-user/:id', md_auth.ensureAuth ,UserController.updateUser);
api.get('/get-image-file/:imageFile',  UserController.getImageFile);
api.get('/keepers',  UserController.getKeepers);



module.exports = api;
