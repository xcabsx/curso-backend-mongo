'use strict'
//modulos
var bcrypt = require('bcrypt-nodejs');

// modelos
var User = require('../models/user');
// servicio jwt
var jwt = require('../services/jwt');
var fs = require('fs');
var path = require('path');



// acciones

function pruebas(req, res){
    res.status(200).send({
        message: 'accion pruebas',
        user: req.user
    });
}

function saveUser(req, res){
   //creo obj usuario
    var user = new User();
   //sacar parametros de peticion
   var params = req.body;

   //asignar valores al usuario


    if(params.password && params.name && params.surname && params.email){
        user.name = params.name;
        user.surname = params.surname;
        user.email = params.email;
        user.role = 'role_user';
        user.image = null;

        User.findOne({email: user.email.toLowerCase()},(err, usuario)=>{
            if(err) {
                res.status(500).send({message: 'error al comprobar usuario'});
            }else{
                if(!usuario){

                    bcrypt.hash(params.password,null,null,function(err, hash){
                        user.password = hash;

                        // guardar ususario en bd
                        user.save((err, userStored )=>{
                            if(err){res.status(500).send({message: 'error al guardar ususario'});
                            }else{
                                if(!userStored){
                                    res.status(404).send({message: 'no se registro el usuario'});
                                }else{
                                    res.status(200).send({user: userStored});
                                }
                            }

                        });
                    });

                }else{
                    res.status(500).send({message: 'usuario ya existe'});

                }

            }
        });

        //cifrar

    }else{
        res.status(500).send({
            message: 'Faltan datos'
        })

    }


}
function login(req, res){
    var user = new User();
    var params = req.body;
    var password = params.password;


    user.email = params.email;


    User.findOne({email: user.email.toLowerCase()},(err, usuario)=>{
        if(err) {
            res.status(500).send({message: 'error al comprobar usuario'});
        }else {
            if (usuario) {
                bcrypt.compare(password,usuario.password,(err, check)=> {
                   if(check){
                       // comprobamos  y generamos token
                       if(params.getToken){
                           //devolver token
                           res.status(200).send(
                               {token: jwt.createToken(usuario)}
                               );


                       }else{
                           res.status(200).send({data: usuario});
                       }


                   } else{
                       res.status(500).send({message: "password incorrecto"});
                   }
                });


            }else{
                res.status(500).send({message: "no existe ususario"});
            }

        }
    });



    if(params.email && params.password){
        // res.status(200).send({message: 'Datos OK'});


    }else{
        res.status(500).send({message: 'Faltan Datos'});
    }




}

function updateUser(req, res){
    var userId = req.params.id;
    var update = req.body;

    if(userId !== req.user.sub){
        return  res.status(500).send({message: 'no tienes permiso para actualizar el usuario'});
    }
    User.findByIdAndUpdate(userId,update, {new:true},(err,userUpdated)=>{
        if(err){
            res.status(500).send({message: 'update error'});
        }else{
            if(!userUpdated){
                res.status(404).send({message: 'no se pudo actualizar el usuario'});
            }else{
                res.status(200).send({user: userUpdated});
            }
        }
    });


}
function uploadImage(req, res){
   var userId = req.params.id;
   var file_name = 'no subido.';

   if(req.files){
       var file_path = req.files.image.path;
       var file_split = file_path.split('\\');
       file_name = file_split[2];

       var ext_split = file_name.split('.');
       var file_ext = ext_split[1];

       if(file_ext === 'png' || file_ext === 'jpg' || file_ext === 'gif'){

           if(userId !== req.user.sub){
                   return  res.status(500).send({message: 'no tienes permiso para actualizar el usuario'});
               }
               User.findByIdAndUpdate(userId,{image: file_name}, {new:true},(err,userUpdated)=>{
                   if(err){
                       res.status(500).send({message: 'update error'});
                   }else{
                       if(!userUpdated){
                           res.status(404).send({message: 'no se pudo actualizar el usuario'});
                       }else{
                           res.status(200).send({user: userUpdated, image: file_name});
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
    var path_file = './uploads/users/'+imagefile;

    fs.exists(path_file,function(exists){
        if(exists){
            res.sendFile(path.resolve(path_file));
        }else{
            res.status(404).send({message: 'no existe imagen'});
        }

    });

}
function getKeepers(req , res){
   User.find({
      role:'role_admin'
   }).exec((err, users)=>{
       if(err){
           res.status(500).send({message: 'error en la peticion '});
       }else{
           if(!users){
               res.status(404).send({message: 'no hay cuidadores'});
           }else{
               res.status(200).send({users: users});
           }

       }
   });

}
// export
module.exports = {
    pruebas,
    saveUser,
    login,
    updateUser,
    uploadImage,
    getImageFile,
    getKeepers

};