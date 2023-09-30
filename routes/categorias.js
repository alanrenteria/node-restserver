const { Router } = require('express')
const { check } = require('express-validator')
const { validarJWT, validarCampos, esAdminRole } = require('../middlewares')
const { crearCategoria, obtenerCategorias, obtenerCategoria, actualizarCategoria, borrarCategoria } = require('../controllers/categorias')
const { existeCategoriaPorId } = require('../helpers/db-validators')

const router = Router()

// Obtener todas las categorias 
router.get('/',obtenerCategorias )
// Obtener una categoria por id 
router.get('/:id',[
    check('id','No es in id de mongo válido').isMongoId(),
    check('id').custom(existeCategoriaPorId),
    validarCampos,
] ,obtenerCategoria)
// Crear una categoria cualquiera con token válido
router.post('/', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos
], crearCategoria)
// Actualizar una categoria cualquiera con token válido
router.put('/:id', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('id').custom(existeCategoriaPorId),
    validarCampos
],actualizarCategoria)
// Borrar una categoria - Admin
router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existeCategoriaPorId),
    validarCampos
],borrarCategoria)

module.exports = router