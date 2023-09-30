const { Router } = require('express')
const { check } = require('express-validator')
const { crearProducto, obtenerProductos, obtenerProducto, actualizarProducto, borrarProducto } = require("../controllers/productos");
const { validarJWT, validarCampos, esAdminRole } = require('../middlewares');
const { existeCategoriaPorId, existeProductoPorId } = require('../helpers/db-validators');

const router = Router()

// Obtener todos los productos 
router.get('/',obtenerProductos )
// Obtener un producto por id 
router.get('/:id',[
    check('id','No es in id de mongo válido').isMongoId(),
    check('id').custom(existeProductoPorId),
    validarCampos,
] ,obtenerProducto)
// Crear un producto cualquiera con token válido 
router.post('/', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('categoria', 'No es un id de mongo').isMongoId(),
    check('categoria').custom(existeCategoriaPorId),
    validarCampos
], crearProducto)
// Actualizar un producto cualquiera con token válido
router.put('/:id', [
    validarJWT,
    check('id', 'No es un id de mongo').isMongoId(),
    check('id').custom(existeProductoPorId),
    validarCampos
],actualizarProducto)
// Borrar un producto - Admin
router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existeProductoPorId),
    validarCampos
],borrarProducto)

module.exports = router;