const { Router } = require('express')
const { check,body } = require('express-validator')
const { validarCampos, validarArchivoSubir } = require('../middlewares')
const { cargarArchivo, actualizarImagen, mostrarImagen, actualizarCoudinary } = require('../controllers/uploads')
const { coleccionesPermitidas } = require('../helpers/db-validators')

const router = Router()
// Carga la imagen o archivo
router.post('/',validarArchivoSubir,cargarArchivo)
// Actualiza la imagen o archivo de cualquier colección por id
router.put('/:coleccion/:id',[
    validarArchivoSubir,
    check('id','El id debe de ser de mongo').isMongoId(),
    check('coleccion').custom(c => coleccionesPermitidas(c, ['usuarios','productos'])),
    //check('coleccion', 'no es una coleccion permitida').isIn(['usuarios', 'productos']),
    validarCampos 
],actualizarCoudinary) 
// ],actualizarImagen) 

// Muestra la imagen del usuario o producto
router.get('/:coleccion/:id',[
    check('id','El id debe de ser de mongo').isMongoId(),
    check('coleccion').custom(c => coleccionesPermitidas(c, ['usuarios','productos'])),
    validarCampos 
],mostrarImagen)

module.exports = router