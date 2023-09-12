const Role = require('../models/role')
const Usuario = require('../models/usuario')
const { response } = require('express')

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

// Verifica si el id existe
const existeUsuarioPorId = async (id = '') => {
    const existeUsuario = await Usuario.findById(id)
    if (!existeUsuario) {
        throw new Error(`El id: ${id} no existe`)
    }
}

module.exports = {
    esRoleValido,
    emailExiste,
    existeUsuarioPorId
}