const { response, json } = require("express");
const bcryptjs = require('bcryptjs')
const Usuario = require('../models/usuario');
const { generarJWT } = require("../helpers/generar-jwt");
const { googleVerify } = require("../helpers/google-verify");

const login = async (req, res = response) => {

    const { correo, password } = req.body

    try {
        // Verificar si correo existe
        const usuario = await Usuario.findOne({ correo })
        if (!usuario) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - correo'
            })
        }
        // Verificar si usuario esta en la BD
        if (!usuario.estado) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - estado: false'
            })
        }
        // Verifica la contraseña
        const validPassword = bcryptjs.compareSync(password, usuario.password)
        if (!validPassword) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - password'
            })
        }
        // Generar el JWT
        const token = await generarJWT(usuario.id)
        res.json({
            usuario,
            token
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Hable con el administrador'
        })
    }
}

const googleSignIn = async (req, res = response) => {
    // Leer id_token del body
    const { id_token } = req.body

    try {
        // 1. Desestructura los datos que necesitamos de googleVerify()
        // 2. Mandar id_token a funcion googleVerify()
        const {nombre, img, correo} = await googleVerify(id_token)
        // Verificar existencia del correo contra la BD
        let usuario = await Usuario.findOne({correo})
        // Si usuario no existe crearlo
        if(!usuario){
            const data ={
                nombre,
                correo,
                password: ':p',
                img,
                rol: "USER_ROLE",
                google: true
            }
            usuario = new Usuario(data)
            // Guardar usuario en BD
            await usuario.save()
        }
        // 
        if(!usuario.estado){
            return res.status(401).json({
                msg: 'Hable con el administrador, usuario bloqueado'
            })
        }
        // Generar el JWT
        const token = await generarJWT(usuario.id)
        // Reflejar cambios
        res.json({
            usuario,
            token
        })
    } catch (error) {
        res.status(400).json({
            ok: false,
            msg: 'El Token no se pudo verificar'
        })
    }
}

module.exports = { 
    login,
    googleSignIn
}