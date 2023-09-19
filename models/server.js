const express = require('express')
const cors = require('cors')
const { dbConnection } = require('../database/config')

class Server {

    constructor() {
        // Crear el servidor de express
        this.app = express()
        // Configuracion del puerto
        this.port = process.env.PORT
        // Nombre de rutas
        this.usuariosPhat = '/api/usuarios'
        this.authPhat = '/api/auth'
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
    }
    routes() {
        // Definimos las rutas de la app
        this.app.use(this.authPhat, require('../routes/auth'))
        this.app.use(this.usuariosPhat, require('../routes/usuarios'))
    }
    listen() {
        // Escuchar peticiones
        this.app.listen(this.port, () => {
            console.log('Servidor corriendo en puerto', this.port);
        })
    }
}

module.exports = Server
