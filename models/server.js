const express = require('express')
const cors = require('cors')

class Server {

    constructor() {
        // Crear el servidor de express
        this.app = express()

        // Nombre de rutas
        this.usuariosPhat = '/api/usuarios'

        // Configuracion del puerto
        this.port = process.env.PORT

        // Middlewares
        this.middlewares()

        // Rutas de mi app
        this.routes();
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
       this.app.use( this.usuariosPhat, require('../routes/usuarios'))
    }
    listen() {
        // Escuchar peticiones
        this.app.listen(this.port, () => {
            console.log('Servidor corriendo en puerto', this.port);
        })
    }
}

module.exports = Server
