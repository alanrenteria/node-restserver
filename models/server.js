const express = require('express')
const cors = require('cors')
const { dbConnection } = require('../database/config')
const fileUpload = require('express-fileupload')

class Server {

    constructor() {
        // Crear el servidor de express
        this.app = express()
        // Configuracion del puerto
        this.port = process.env.PORT
        // Nombre de rutas
        this.paths = {
            auth: '/api/auth',
            buscar: '/api/buscar',
            categorias: '/api/categorias',
            productos: '/api/productos',
            usuarios: '/api/usuarios',
            uploads: '/api/uploads'
        }
        // this.usuariosPhat = '/api/usuarios'
        // this.authPhat = '/api/auth'
        //Conectar DB
        this.conectarDB()
        // Middlewares
        this.middlewares()
        // Rutas de mi app
        this.routes();
    }
    async conectarDB() {
        await dbConnection()
    }
    middlewares() {
        // Cors, conf de protección del servidor
        this.app.use(cors())
        // Lectura y parseo del body
        this.app.use(express.json())
        // Directorio Público
        this.app.use(express.static('public'))
        // Carga de archivos
        this.app.use(fileUpload({
            useTempFiles: true,
            tempFileDir: '/tmp/',
            createParentPath: true
        }));
    }
    routes() {
        // Definimos las rutas de la app
        this.app.use(this.paths.auth, require('../routes/auth'))
        this.app.use(this.paths.buscar, require('../routes/buscar'))
        this.app.use(this.paths.categorias, require('../routes/categorias'))
        this.app.use(this.paths.productos, require('../routes/productos'))
        this.app.use(this.paths.usuarios, require('../routes/usuarios'))
        this.app.use(this.paths.uploads, require('../routes/uploads'))
    }
    listen() {
        // Escuchar peticiones
        this.app.listen(this.port, () => {
            console.log('Servidor corriendo en puerto', this.port);
        })
    }
}

module.exports = Server
