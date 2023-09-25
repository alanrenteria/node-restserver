const { Router } = require('express')
const { check } = require('express-validator')
const { validarCampos } = require('../middlewares/validar-campos')
const { login, googleSignIn } = require('../controllers/auth')


const router = Router()

// Crear 
router.post('/login',[
    check('correo', 'El correo es obligatorio').isEmail(),
    check('password', 'La contraseña es obligatoria').not().isEmpty(),
    validarCampos
], login )

// Crear login google
router.post('/google',[
    check('id_token', 'id_token de google es necesario').not().isEmpty(),
    validarCampos 
], googleSignIn)

module.exports = router