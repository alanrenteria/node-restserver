const { Router } = require('express')
const { check } = require('express-validator')
const { usuariosGet, usuariosPost, usuariosPut, usuariosPatch, usuariosDelete } = require('../controllers/usuarios')
const { validarCampos } = require('../middlewares/validar-campos')
const { esRoleValido, emailExiste, existeUsuarioPorId } = require('../helpers/db-validators')

const router = Router()
// Leer
router.get('/', usuariosGet)
// Actualizar
router.put('/:id', [
    check('id', 'No es un ID válido').isMongoId(), 
    check('id').custom(existeUsuarioPorId),
    check('rol').custom(esRoleValido),
    validarCampos
], usuariosPut)
// Crear 
router.post('/', [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'El password debe ser mayor a 6 letras').isLength({ min: 6 }),
    check('correo', 'El correo no es válido').isEmail(),
    check('correo').custom(emailExiste),
    // check('rol', 'No es un rol válido').isIn(['ADMIN_ROLE','USER_ROLE']),
    check('rol').custom(esRoleValido),
    validarCampos
], usuariosPost)

router.patch('/', usuariosPatch)
// Borrar 
router.delete('/:id',[
    check('id', 'No es un ID válido').isMongoId(), 
    check('id').custom(existeUsuarioPorId),
    validarCampos
], usuariosDelete)

module.exports = router