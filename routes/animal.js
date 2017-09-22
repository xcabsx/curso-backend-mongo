'use strict'

var express = require('express');
var AnimalController = require('../controllers/animals');
var md_auth = require('../middlewares/authenticate');
var md_admin = require('../middlewares/is_admin');
var multipart = require('connect-multiparty');
var md_upload = multipart({ uploadDir: './uploads/animals'});

var api = express.Router();

api.get('/animal',  AnimalController.pruebas);
api.post('/animal', [md_auth.ensureAuth,md_admin.isAdmin] ,AnimalController.saveAnimal);
api.get('/animals', md_auth.ensureAuth ,AnimalController.getAnimals);
api.get('/animal/:id', md_auth.ensureAuth ,AnimalController.getAnimal);
api.post('/update/:id', [md_auth.ensureAuth,md_admin.isAdmin] ,AnimalController.updateAnimal);
api.post('/upload-image-animal/:id', [md_auth.ensureAuth, md_upload] , AnimalController.uploadImage);
//api.post('/update-user/:id', md_auth.ensureAuth ,UserController.updateUser);
api.get('/get-image-file-animal/:imageFile',  AnimalController.getImageFile);
api.post('/delete-animal/:id', [md_auth.ensureAuth,md_admin.isAdmin] ,AnimalController.deleteAnimal);


module.exports = api;