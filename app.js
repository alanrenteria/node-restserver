require('dotenv').config()
const Server = require('./models/server')

// Ejecutamos el servidor 
const server = new Server()
server.listen()




