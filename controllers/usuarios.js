const { response } = require('express')
const bcryptjs = require('bcryptjs')
const Usuario = require('../models/usuario')

// Leer un usuario:_______________________________________________________________
const usuariosGet = async (req, res = response) => {
    // Extrae toda la info de req.body
    const { limite = 5, desde = 0 } = req.query
    // Condición que filtra los registros borrados 
    const query = { estado: true }
    // Ejecuta promesas de manera simultanea
    const [total, usuarios] = await Promise.all([
        // Conteo de todos los registros de la BD
        Usuario.countDocuments(query),
        // Busca los usuarios
        Usuario.find(query)
            .skip(Number(desde))
            .limit(Number(limite))
    ])
    // Refleja los cambios
    res.json({
        total,
        usuarios
    })
}
// Crear un usuario:______________________________________________________________ 
const usuariosPost = async (req, res = response) => {

    // Extrae toda la info de req.body
    const { nombre, correo, password, rol } = req.body
    // Nueva instancia del modelo usuario y mandamos los argumentos 
    const usuario = new Usuario({ nombre, correo, password, rol })
    // Encriptar la contraseña
    const salt = bcryptjs.genSaltSync()
    usuario.password = bcryptjs.hashSync(password, salt)
    // Guarda la informacion en mongo
    await usuario.save();
    // Refleja los cambios
    res.json({
        usuario
    })
}
// Actualizar un usuario:_________________________________________________________
const usuariosPut = async (req, res = response) => {
    const { id } = req.params
    // Extrae toda la info de req.body
    const { _id, password, google, correo, ...resto } = req.body
    // validar password contra BD
    if (password) {
        // Encriptar la contraseña
        const salt = bcryptjs.genSaltSync()
        resto.password = bcryptjs.hashSync(password, salt)
    }
    // Actualizar un usuario por id
    const usuario = await Usuario.findByIdAndUpdate(id, resto)
    // Refleja los cambios
    res.json(usuario)
}
const usuariosPatch = (req, res = response) => {
    res.json({
        msg: 'patch API - controlador'
    })
}
const usuariosDelete = async (req, res = response) => {

    const { id } = req.params
    /* Borrado Fisico
       const usuario = await Usuario.findByIdAndDelete(id) */

    const usuario = await Usuario.findByIdAndUpdate(id, { estado: false })
    
    res.json({
        usuario
    })
}

module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosPatch,
    usuariosDelete
}