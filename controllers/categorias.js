const { response } = require("express");
const { Categoria } = require("../models");

const obtenerCategorias = async (req, res = response) => {
    // Extrae toda la info de req.body
    const { limite = 5, desde = 0 } = req.query
    // Condición que filtra los registros borrados 
    const query = { estado: true }
    // Ejecuta promesas de manera simultanea
    const [total, categorias] = await Promise.all([
        // Conteo de todos los registros de la BD
        Categoria.countDocuments(query),
        // Busca los usuarios
        Categoria.find(query)
            .skip(Number(desde))
            .limit(Number(limite))
            .populate('usuario', 'nombre')
    ])
    // Refleja los cambios
    res.json({
        total,
        categorias
    })
}
const obtenerCategoria = async (req, res = response) => {
    // Extraer id que viene en req.params
   const{id} = req.params
   // Busca en DB la categoria por id
   const categoria = await Categoria.findById(id).populate('usuario', 'nombre')
   // Refleja cambios
   res.json(categoria)
}
const crearCategoria = async (req, res = response) => {
    // Extraer el nombre de req.body
    const nombre = req.body.nombre.toUpperCase()
    // Verifica existencia de la categoria
    const categoriaDB = await Categoria.findOne({ nombre })
    if (categoriaDB) {
        return res.status(400).json({
            msg: `La categoria ${categoriaDB.nombre} ya existe`
        })
    }
    // Generar la data a guardar
    const data = {
        nombre,
        usuario: req.usuario._id
    }
    // Nueva instancia del modelo categoria y mandamos los argumentos 
    const categoria = new Categoria(data)
    // Guarda la informacion en mongo
    await categoria.save()
    // Refleja los cambios
    res.status(201).json(categoria)
}
const actualizarCategoria = async (req, res = response) => {
    // Extraer id que viene en req.params
    const { id } = req.params
    // Extrae toda la info de req.body
    const {estado, usuario,  ...data } = req.body
    // Guardar nombre en mayusculas
    data.nombre =  data.nombre.toUpperCase()
    // Id del usuario dueño del token
    data.usuario = req.usuario._id
    // Actualizar un usuario por id
    const categoria = await Categoria.findByIdAndUpdate(id, data, {new:true})
    // Refleja los cambios
    res.json(categoria)
}
const borrarCategoria = async (req, res = response) => {
    /* Borrado Fisico:
      const usuario = await Usuario.findByIdAndDelete(id) */
    // Leer id de los parametros
    const { id } = req.params
    // Cambia el estado a false para simular el borrado
    const categoriaBorrada = await Categoria.findByIdAndUpdate(id, { estado: false}, {new:true })
    // Refleja los cambios
    res.json({
        categoriaBorrada
    })
}
module.exports = {
    crearCategoria,
    obtenerCategorias,
    obtenerCategoria,
    actualizarCategoria,
    borrarCategoria
}