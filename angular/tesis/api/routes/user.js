const express = require('express');
const mysqlConnection = require('../connection/connection');
const router = express.Router();
const mysqlConnetion = require('../connection/connection');

const jwt = require('jsonwebtoken');

//const { post } = require('../../app');

router.get('/', (req, res) => {
    mysqlConnection.query('select * from empresa', (err, rows, fields) => {
        if (!err) {
            res.json(rows)
        } else {
            res.json(err)
        }
    })
});    //listar todos los usuarios y comprobar que este funcionando

router.post('/singin', (req, res) => {
    
    const email = req.body.email
    const password = req.body.password
    
    mysqlConnection.query('select nombre_usuario, id_usuario,estado, rol from usuario where email=? and password=?',
        [email, password], (err, rows, fields) => {
            if (!err) {
                if (rows.length == 0) {
                    res.json('Usuario o clave incorrectos');
                    
                } else {
                    if(rows[0]['estado'] =='Habilitado'){
                        let data = JSON.stringify(rows[0]);
                        const token = jwt.sign(data, 'jav'); //
                        res.json({ token }); //token respuesta contiene la informacion de la consulta, pero tokenificado
                    }else{
                        res.json('El usuario se encuentra Inhabilitado')
                    }
                }
            } else {
                res.json(err)
            }
        }
    )
});


// obtener datos del usuario 
router.get('/datos-usuario/:id', (req, res) => {
    
    mysqlConnection.query('select * from usuario where id_usuario=?', [req.params.id], (err, rows, fields) => {
        if (!err) {
            res.json(rows)
        } else {
            res.json(err)
        }
    })
})

router.post('/singup', (req, res) => {
    
    const name = req.body.nombre_usuario
    const direccion = req.body.direccion_usuario
    //const facebook = req.body.id_facebook
    const email = req.body.email
    const password = req.body.password
    mysqlConnection.query('INSERT INTO usuario(nombre_usuario, direccion_usuario, email, password) VALUES (?,?,?,?)',
        [name, direccion, email, password], (err, rows, fields) => {
            if (!err) {
                res.json('Correctamente agregado');
            } else {
                res.json('Error al registrar los datos');
            }
        }
    )
});

// obtener los resultados query consulta datos publicacion 

router.get('/resultados/publicacion/:id', (req, res) => {
    
    mysqlConnection.query('select * from publicacion where id_publicacion=?', [req.params.id], (err, rows, fields) => {
        if (!err) {
            res.json(rows)
        } else {
            res.json(err)
        }
    })
})


// obetener todas las publicaciones por un usuario 
router.get('/publicaciones/usuario/:id', (req, res) => {
    
    mysqlConnection.query('select * from publicacion where id_usuario=? order by fecha desc', [req.params.id], (err, rows, fields) => {
        if (!err) {

            if (rows.length == 0) {
                res.json('El usuario aun no cuenta con publicaciones')
            } else {
                res.json(rows)
            }
        } else {
            res.json(err)
        }
    })
});

// obtener comentarios de una publicacion

router.get('/publicacion/comentarios/:id', (req, res) => {
    
    mysqlConnection.query('SELECT * from comentarios where id_publicacion=?', [req.params.id], (err, rows, fields) => {
        if (!err) {

            if (rows.length == 0) {
                res.json('La publicacion no cuenta con comentarios')
            } else {
                res.json(rows)
            }
        } else {
            res.json(err)
        }
    })
})

// obtener num comentarios  y respuestas 
router.get('/publicacion/totalComentarios/:id', (req, res) => {
    
    var cont =0;
    mysqlConnection.query('SELECT * from comentarios where id_publicacion=?', [req.params.id], (err, rows, fields) => {
        if (!err) {

            if (rows.length == 0) {
                res.json('La publicacion no cuenta con comentarios')
            } else {
                cont = rows.length
                mysqlConnection.query('SELECT r.id_respuesta_comentarios, r.detalle_respuesta, r.sentimiento, r.id_comentario, r.num_topico from comentarios c, respuesta_comentarios r where c.id_publicacion=? and c.id_comentario= r.id_comentario', [req.params.id], (err, rows2, fields) => {
                    if (!err) {
            
                        if (rows2.length == 0) {
                            var c={
                                total:cont
                            }
                            res.json(c)

                        } else {
                            cont += rows2.length
                            

                            var c={
                                total:cont
                            }
                            res.json(c)
                        }
                    } else {
                        res.json(err)
                    }
                })
            }
        } else {
            res.json(err)
        }
    })
    
    
})

// obtener respuestas de los comentarios 
router.get('/publicacion/respuestas/:id', (req, res) => {
    
    mysqlConnection.query('SELECT r.id_respuesta_comentarios, r.detalle_respuesta, r.sentimiento, r.id_comentario, r.num_topico from comentarios c, respuesta_comentarios r where c.id_publicacion=? and c.id_comentario= r.id_comentario', [req.params.id], (err, rows, fields) => {
        if (!err) {

            if (rows.length == 0) {
                res.json('La publicacion no cuenta con respuestas a comentarios')
            } else {
                res.json(rows)
            }
        } else {
            res.json(err)
        }
    })
})
// obtener datos del usuarioo 
router.get('/datos/usuario/:id', (req, res) => {

    const id_usuario = req.params.id
    
    mysqlConnection.query('SELECT * FROM usuario WHERE id_usuario=?', [id_usuario], (err, rows, field) => {
        if (!err) {
            if (rows.length == 0) {
                res.json("No existe el usuario")
            } else {
                res.json(rows)
            }
        } else {
            res.json('Error al conseguir los datos')
        }
    })
})

// actualizar rating publicacion 

router.post('/publicacion/actualizar/rating', (req, res) => {

    const id = req.body.id
    const rating = req.body.rating
    
    //const facebook = req.body.id_facebook
    mysqlConnection.query(`UPDATE publicacion SET rating=? WHERE id_publicacion=?`,
        [rating, id], (err, rows, fields) => {
            if (!err) {
                res.json('Correctamente actualizado');
            } else {
                res.json('Error al registrar los datos');
            }
        }
    )
});

//actualizar datos del usuario 
router.post('/datos/usuario/actualizar', (req, res) => {
    
    mysqlConnection.query('UPDATE usuario SET nombre_usuario=?, direccion_usuario=?, email=?, password=? WHERE id_usuario=?',
        [req.body.nombre_usuario, req.body.direccion_usuario, req.body.email, req.body.password, req.body.id_usuario], (err, rows, field) => {
            if (!err) {
                res.json("Actualizado correctamente")
            } else {
                res.json("Error mientras se actualizaba sus datos")
            }
        }
)});


// ******     ADMINISTRADOR     ******

// obtener lista de usuarios 
router.get('/admin/lista-usuarios/',(req,res)=>{
    mysqlConnection.query("select * from usuario where rol='user'", (err, rows, fields) => {
        if (!err) {
            res.json(rows)
        } else {
            res.json(err)
        }
    })
});

// actualizar usuario 
router.post('/admin/actualizar-usuario/',(req,res)=>{
    mysqlConnection.query('UPDATE usuario SET nombre_usuario=?, direccion_usuario=?, email=?, password=?, rol=?, estado=? WHERE id_usuario=?',
    [req.body.nombre_usuario, req.body.direccion_usuario, req.body.email, req.body.password,req.body.rol, req.body.estado, req.body.id_usuario], (err, rows, field) => {
        if (!err) {
            res.json("Actualizado correctamente")
        } else {
            res.json("Error mientras se actualizaba sus datos")
        }
    }
    )
});

// agregar nuevo usuario con todos los datos 
router.post('/admin/crear-usuario/',(req,res)=>{
    
    mysqlConnection.query('INSERT INTO usuario(nombre_usuario, direccion_usuario, email, password, estado, rol) VALUES (?,?,?,?,?,?)',
    [req.body.nombre_usuario, req.body.direccion_usuario, req.body.email, req.body.password,req.body.estado, req.body.rol,], (err, rows, field) => {
        if (!err) {
            res.json("Agregado correctamente")
        } else {
            res.json("Error agregar nuevo usuario")
        }
    }
    )
});



router.post('/test', verifyToken, (req, res) => {

    //validar rol
    //if(req.data.rol ==="user"){}
    res.json('Informacion secreta');
});

// funcion para verificar que existe ese token 

function verifyToken(req, res, next) {
    if (!req.headers.authorization) return res.status(401).json('No autorizado')

    const token = req.headers.authorization.substr(7);
    if (token !== '') {
        const content = jwt.verify(token, 'jav'); //verificare que el token existe decofificando la info
        req.data = content;
        next();
    } else {
        res.status(401).json('Token vacio')
    }
}
module.exports = router;

