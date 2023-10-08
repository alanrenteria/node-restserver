const path = require('path')
const fs = require('fs')
const cloudinary = require('cloudinary').v2
cloudinary.config(process.env.CLOUDINARY_URL);
const { response } = require("express");
const { subirArchivo } = require("../helpers/subir-archivo");
const { Usuario, Producto } = require("../models");
const { log } = require('console');

const cargarArchivo = async (req, res = response) => {

    try {
        //const nombre = await subirArchivo(req.files,['txt','md'],'textos')
        const nombre = await subirArchivo(req.files, undefined, 'imgs')
        // Refleja cambios 
        res.json({
            nombre
        })
    } catch (msg) {
        res.status(400).json({ msg })
    }

}
const actualizarImagen = async (req, res = response) => {

    // Extraemos de req.params el id y coleccion
    const { id, coleccion } = req.params
    // Validamos usuarios y productos
    let modelo
    switch (coleccion) {
        case 'usuarios':
            // Busca el Usuario por id y lo iguala a modelo
            modelo = await Usuario.findById(id)
            if (!modelo) {
                return res.status(500).json({
                    msg: `No existe un usuario con el id ${id}`
                })
            }
            break;
        case 'productos':
            // Busca el Producto por id y lo iguala a modelo
            modelo = await Producto.findById(id)
            if (!modelo) {
                return res.status(500).json({
                    msg: `No existe un producto con el id ${id}`
                })
            }
            break;
        default:
            return res.status(400).json({ msg: 'Se me olvidó validar esto' })
    }
    // Limpiar imágenes previas
    if (modelo.img) {
        // Obtenemos la ruta de la imagen 
        const phatImagen = path.join(__dirname, '../uploads', coleccion, modelo.img)
        if (fs.existsSync(phatImagen)) {
            // Borrar la imágen del servidor
            fs.unlinkSync(phatImagen)
        }
    }
    // Subimos el archivo de req.files junto al nombre de la carpeta 'coleccion'
    const nombre = await subirArchivo(req.files, undefined, coleccion)
    // Obtenemos la ruta de la img y la igualamos a la propiedad img del modelo
    modelo.img = nombre
    // Guardamos en BD
    await modelo.save()
    // Refleja cambios
    res.json({ modelo })
}
const actualizarCoudinary = async (req, res = response) => {
    // Extraemos de req.params el id y coleccion
    const { id, coleccion } = req.params
    // Validamos usuarios y productos
    let modelo
    switch (coleccion) {
        case 'usuarios':
            // Busca el Usuario por id y lo iguala a modelo
            modelo = await Usuario.findById(id)
            if (!modelo) {
                return res.status(500).json({
                    msg: `No existe un usuario con el id ${id}`
                })
            }
            break;
        case 'productos':
            // Busca el Producto por id y lo iguala a modelo
            modelo = await Producto.findById(id)
            if (!modelo) {
                return res.status(500).json({
                    msg: `No existe un producto con el id ${id}`
                })
            }
            break;
        default:
            return res.status(400).json({ msg: 'Se me olvidó validar esto' })
    }
    // Limpiar imágenes previas de cloudinary
    if (modelo.img) {
        const nombreArr = modelo.img.split('/')
        const nombre = nombreArr[ nombreArr.length - 1 ]
        const [ public_id ] = nombre.split('.')
        cloudinary.uploader.destroy(public_id)
    }
    // Extraemos la ruata temporal
    const { tempFilePath } = req.files.archivo
    // Extraemos el url de la imagen
    const { secure_url } = await cloudinary.uploader.upload(tempFilePath)
    // Tomamos la ruta de la img y la igualamos a la propiedad img del modelo
    modelo.img = secure_url
    // Guardamos en BD
    await modelo.save()
    // Refleja cambios
    res.json({ modelo })
}
const mostrarImagen = async (req, res = response) => {

    // Extraemos de req.params el id y coleccion
    const { id, coleccion } = req.params
    // Validamos usuarios y productos
    let modelo
    switch (coleccion) {
        case 'usuarios':
            // Busca el Usuario por id y lo iguala a modelo
            modelo = await Usuario.findById(id)
            if (!modelo) {
                return res.status(500).json({
                    msg: `No existe un usuario con el id ${id}`
                })
            }
            break;
        case 'productos':
            // Busca el Producto por id y lo iguala a modelo
            modelo = await Producto.findById(id)
            if (!modelo) {
                return res.status(500).json({
                    msg: `No existe un producto con el id ${id}`
                })
            }
            break;
        default:
            return res.status(400).json({ msg: 'Se me olvidó validar esto' })
    }
    if (modelo.img) {
        // Obtenemos la ruta de la imagen 
        const phatImagen = path.join(__dirname, '../uploads', coleccion, modelo.img)
        if (fs.existsSync(phatImagen)) {
            // Enviamos la imagen 
            return res.sendFile(phatImagen)
        }
    }
    // Si no encuentra la imagen muestra una por defecto
    const phatNoImagen = path.join(__dirname, '../assets/no-image.jpg')
    return res.sendFile(phatNoImagen)
}
module.exports = {
    cargarArchivo,
    actualizarImagen,
    mostrarImagen,
    actualizarCoudinary
}