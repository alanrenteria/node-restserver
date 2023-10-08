const Role = require('../models/role')
const { Usuario, Categoria, Producto } = require('../models')

// Verifica si el rol existe
const esRoleValido = async (rol = '') => {
    const existeRol = await Role.findOne({ rol })
    if (!existeRol) {
        throw new Error(`El rol ${rol} no esta registrado en la BD`)
    }
}
// Verifica si el correo existe
const emailExiste = async (correo = '') => {
    const existeEmail = await Usuario.findOne({ correo })
    if (existeEmail) {
        throw new Error(`El correo: ${correo}, ya esta registrado`)
    }
}

// Verifica si el usuario existe
const existeUsuarioPorId = async (id = '') => {
    const existeUsuario = await Usuario.findById(id)
    if (!existeUsuario) {
        throw new Error(`El id: ${id} no existe`)
    }
}
// Verifica si la categoria existe
const existeCategoriaPorId = async (id = '') => {
    const existeCategoria = await Categoria.findById(id)
    if (!existeCategoria) {
        throw new Error(`El id: ${id} no existe`)
    }
}
// Verifica si el producto existe
const existeProductoPorId = async (id = '') => {
    const existeProducto = await Producto.findById(id)
    if (!existeProducto) {
        throw new Error(`El id: ${id} no existe`)
    }
}
// Validar las colecciones permitidas
const coleccionesPermitidas = (coleccion = '', colecciones = []) => {
    const incluida = colecciones.includes(coleccion)
    if (!incluida) {
        throw new Error(`La coleccion: ${coleccion} no es permitida, ${colecciones}`)
    }
    return true
}

module.exports = {
    esRoleValido,
    emailExiste,
    existeUsuarioPorId,
    existeCategoriaPorId,
    existeProductoPorId,
    coleccionesPermitidas
}