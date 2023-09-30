const { response } = require("express");
const { Producto } = require("../models");

const obtenerProductos = async (req, res = response) => {
    // Extrae toda la info de req.body
    const { limite = 5, desde = 0 } = req.query
    // Condición que filtra los registros borrados 
    const query = { estado: true }
    // Ejecuta promesas de manera simultanea
    const [total, productos] = await Promise.all([
        // Conteo de todos los registros de la BD
        Producto.countDocuments(query),
        // Busca los productos
        Producto.find(query)
            .skip(Number(desde))
            .limit(Number(limite))
            .populate('usuario', 'nombre')
    ])
    // Refleja los cambios
    res.json({
        total,
        productos
    })
}
const obtenerProducto = async (req, res = response) => {
    // Extraer id que viene en req.params
    const { id } = req.params
    // Busca en DB el producto por id
    const producto = await Producto.findById(id).populate('usuario', 'nombre')
    // Refleja cambios
    res.json(producto)
}
const crearProducto = async (req, res = response) => {
    // Extraer los datos que no queremos y el resto se guarda en ...body
    const { estado, usuario, ...body } = req.body
    // Verifica existencia del producto
    const productoDB = await Producto.findOne({ nombre: body.nombre.toUpperCase() })
    if (productoDB) {
        return res.status(400).json({
            msg: `El producto ${productoDB.nombre} ya existe`
        })
    }
    // Generar la data a guardar
    const data = {
        ...body,
        nombre: body.nombre.toUpperCase(),
        usuario: req.usuario._id,
    }
    // Nueva instancia del modelo producto y mandamos los argumentos 
    const producto = new Producto(data)
    // Guarda la informacion en mongo
    await producto.save()
    // Refleja los cambios
    res.status(201).json(producto)
}
const actualizarProducto = async (req, res = response) => {
    // Extraer id que viene en req.params
    const { id } = req.params
    // Extrae toda la info de req.body
    const { estado, usuario, ...data } = req.body
    // Guardar nombre en mayusculas
    data.nombre = data.nombre.toUpperCase()
    // Id del usuario dueño del token
    data.usuario = req.usuario._id
    // Actualizar un producto por id
    const producto = await Producto.findByIdAndUpdate(id, data, { new: true })
    // Refleja los cambios
    res.json(producto)
}
const borrarProducto = async (req, res = response) => {
    /* Borrado Fisico:
      const usuario = await Usuario.findByIdAndDelete(id) */
    // Leer id de los parametros
    const { id } = req.params
    // Cambia el estado a false para simular el borrado
    const productoBorrado = await Producto.findByIdAndUpdate(id, { estado: false}, {new:true })
    // Refleja los cambios
    res.json({
        productoBorrado
    })
}
module.exports = {
    crearProducto,
    obtenerProductos,
    obtenerProducto,
    actualizarProducto,
    borrarProducto
}