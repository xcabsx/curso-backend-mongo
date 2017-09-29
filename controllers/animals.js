'use strict'
//modulos


// modelos
var User = require('../models/user');
var Animal = require('../models/animal');
// servicio jwt

var fs = require('fs');
var path = require('path');

function pruebas(req, res){

}
function saveAnimal(req, res){

    var animal = new Animal();
    var params = req.body;



    if(params.name){

        animal.name = params.name;
        animal.description = params.description;
        animal.year = params.year;
        animal.image = null;
        animal.user = req.user.sub;

        animal.save((err, animalStored)=>{
            if(err){
                res.status(500).send({message: 'error en el servidor'});
            }else{
                if(!animalStored){
                    res.status(500).send({message: 'no se puede guardar el animal'});
                }else{
                    res.status(200).send({animal: animalStored});
                }
            }

        });
    }else{
        res.status(200).send({message: 'Debe completar todos los datos'});
    }

}
function getAnimals(req, res) {
    Animal.find({}).populate({path:'user'}).exec((err, animals)=>{
        if(err){
            res.status(500).send({message: 'error'});
        }else{
            if(!animals){
                res.status(404).send({message: 'no hay animales para mostrar'});
            }else{
                res.status(200).send({animals: animals});
            }

        }
    });
}
function getAnimal(req , res) {
    var animalId = req.params.id;
    Animal.findById(animalId).populate({path:'user'}).exec((err,animal)=>{
        if(err){
            res.status(500).send({message: 'error'});
        }else {
            if (!animal) {
                res.status(404).send({message: 'no hay animales para mostrar'});
            } else {
                res.status(200).send({animal: animal});
            }
        }
        });


}
function updateAnimal(req, res) {
    var animalId = req.params.id;
    var update = req.body;

    /*if(userId !== req.user.sub){
        return  res.status(500).send({message: 'no tienes permiso para actualizar el usuario'});
    }*/
    Animal.findByIdAndUpdate(animalId,update, {new:true},(err,animalUpdated)=>{
        if(err){
            res.status(500).send({message: 'update error'});
        }else{
            if(!animalUpdated){
                res.status(404).send({message: 'no se pudo actualizar el animal'});
            }else{
                res.status(200).send({animal: animalUpdated, message: 'voy'});
            }
        }
    });

}
function uploadImage(req, res){
    var animalId = req.params.id;
    var file_name = 'no subido.';

    if(req.files){
        var file_path = req.files.image.path;
        var file_split = file_path.split('\\');
        file_name = file_split[2];

        var ext_split = file_name.split('.');
        var file_ext = ext_split[1];

        if(file_ext === 'png' || file_ext === 'jpg' || file_ext === 'gif'){


            Animal.findByIdAndUpdate(animalId,{image: file_name}, {new:true},(err,animalUpdated)=>{
                if(err){
                    res.status(500).send({message: 'update error'});
                }else{
                    if(!animalUpdated){
                        res.status(404).send({message: 'no se pudo actualizar el animal'});
                    }else{
                        res.status(200).send({animal: animalUpdated, image: file_name});
                    }
                }
            });

        }else{
            fs.unlink(file_path, (err)=>{
                if(err){
                    res.status(200).send({message: 'extension no valida'});
                }else{
                    res.status(200).send({message: 'extension no valida, fichero no borrado'});
                }
            });
            res.status(200).send({message: 'extension no valida'});

        }

    }else{
        res.status(200).send({message: 'no se ha subido ningun archivo'});
    }


}

function getImageFile(req, res){
    //res.status(200).send({message:'getimagefule'});
    var imagefile = req.params.imageFile;
    var path_file = './uploads/animals/'+imagefile;

    fs.exists(path_file,function(exists){
        if(exists){
            res.sendFile(path.resolve(path_file));
        }else{
            res.status(404).send({message: 'no existe imagen'});
        }

    });

}
function deleteAnimal(req, resp) {
    var animalId = req.params.id;
    Animal.findByIdAndRemove(animalId,(err , animalRemoved)=>{
        if(err){
            res.status(500).send({message: 'error en la peticionn'});
        }else{
           if(!animalRemoved){
               res.status(404).send({message: 'no se ha podido borrar'});
           } else{
               res.status(200).send({animal: animalRemoved });
           }
        }

    });

}
// export
module.exports = {
    pruebas,
    saveAnimal,
    getAnimals,
    getAnimal,
    updateAnimal,
    uploadImage,
    getImageFile,
    deleteAnimal
};