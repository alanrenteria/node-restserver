const { response, request } = require('express');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario')

const validarJWT = async (req = request, res = response, next) => {
    // Leer token del header
    const token = req.header('x-token')
    // Comprueba existencia del JWT
    if (!token) {
        return res.status(401).json({
            msg: 'No hay token en la petición'
        })
    }
    try {
        // Comprueba JWT valido
        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY)
        // leer usuario que corresponde a uid
        const usuario = await Usuario.findById(uid)
        // Verificar si el usuario existe
        if (!usuario) {
            return res.status(401).json({
                msg: 'Token no valido - Usuario no existe en DB'
            })
        }
        // Verificar si uid tiene estado en true
        if (!usuario.estado) {
            return res.status(401).json({
                msg: 'Token no valido - Usuario con estado: false'
            })
        }
        // Guardamos la info de usuario autenticado en req.usuario
        req.usuario = usuario
        // Si todo pasa entonces continua next()
        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({
            msg: 'Token no valido'
        })
    }
}

module.exports = {
    validarJWT
}