const { response } = require("express");
const { ObjectId } = require("mongoose").Types;
const { Usuario, Categoria, Producto } = require('../models')

const coleccionesPermitidas = [
    'usuarios',
    'categorias',
    'productos',
    'roles'
]
const buscarUsuarios = async (termino = '', res = response) => {
    // Verifica si es un id de mongo
    const esMongoId = ObjectId.isValid(termino)
    // Si es un id de mongo busca por id
    if (esMongoId) {
        const usuario = await Usuario.findById(termino)
        return res.json({
            /*
            results:(usuario)?, si usuario existe
            [usuario], retornar usuario
            : [], de lo contrario [arreglo] vacio
            */
            results: (usuario) ? [usuario] : []
        })
    }
    // Regex que vuelve insensible al termino a mayúsculas y minúsculas
    const regex = new RegExp(termino, 'i')
    // Consulta a la BD
    const usuarios = await Usuario.find({
        $or: [{ nombre: regex }, { correo: regex }],
        $and: [{ estado: true }]
    })
    // Reflejamos cambios
    return res.json({
        results: usuarios
    })
}
const buscarCategorias = async (termino = '', res = response) => {
    // Verifica si es un id de mongo
    const esMongoId = ObjectId.isValid(termino)
    // Si es un id de mongo busca por id
    if (esMongoId) {
        const categoria = await Categoria.findById(termino).populate('usuario','nombre')
        return res.json({
            /*
            results:(usuario)?, si usuario existe
            [usuario], retornar usuario
            : [], de lo contrario [arreglo] vacio
            */
            results: (categoria) ? [categoria] : []
        })
    }
    // Regex que vuelve insensible al termino a mayúsculas y minúsculas
    const regex = new RegExp(termino, 'i')
    // Consulta a la BD
    const categorias = await Categoria.find({nombre: regex, estado: true}).populate('usuario','nombre')
    // Reflejamos cambios
    return res.json({
        results: categorias
    })
}
const buscarProductos = async (termino = '', res = response) => {
    // Verifica si es un id de mongo
    const esMongoId = ObjectId.isValid(termino)
    // Si es un id de mongo busca por id
    if (esMongoId) {
        const producto = await Producto.findById(termino).populate('categoria','nombre')
        return res.json({
            /*
            results:(usuario)?, si usuario existe
            [usuario], retornar usuario
            : [], de lo contrario [arreglo] vacio
            */
            results: (producto) ? [producto] : []
        })
    }
    // Regex que vuelve insensible al termino a mayúsculas y minúsculas
    const regex = new RegExp(termino, 'i')
    // Consulta a la BD
    const productos = await Producto.find({nombre: regex, estado: true}).populate('categoria','nombre')
    // Reflejamos cambios
    return res.json({
        results: productos
    })
}
const buscar = (req, res = response) => {

    // Extraemos de req.params coleccio y termino
    const { coleccion, termino } = req.params
    // Verificamos que la colección extraída exista
    if (!coleccionesPermitidas.includes(coleccion)) {
        return res.status(400).json({
            msg: `Las colecciones permitidas son: ${coleccionesPermitidas} `
        })
    }
    switch (coleccion) {
        case 'usuarios':
            buscarUsuarios(termino, res)
        case 'categorias':
            buscarCategorias(termino, res)
            break
        case 'productos':
            buscarProductos(termino, res)
            break
        default:
            return res.status(500).json({
                msg: 'Se le olvido hacer esta búsqueda'
            })
    }
}
module.exports = {
    buscar
};