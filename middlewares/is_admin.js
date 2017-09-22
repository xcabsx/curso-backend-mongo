'use strict'

exports.isAdmin = function(req, res, next){
    if(req.user.role != 'ROLE_ADMIN'){
        return res.status(403).send({
            message: 'No tienes acceso1'+req.user.role
        });

    }

    next();

};