# Ejecutar una app de Node.js
la primera forma es poner en la terminal el comando node mas el nombre de nuestro archivo principal: 
```
node index.js
```
La segunda forma es abrir el package.json de nuestro proyecto y agregar el comando ***start*** dentro del apartado ***scripts*** seguido de la instrucción de ejecución vista en el paso anterior:
```json
{
  "name": "05-clima-app",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "type": "module",
  "scripts": {
    "start": "node index.js" // instrucción de ejecución.
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "axios": "^1.4.0",
    "colors": "^1.4.0",
    "dotenv": "^16.1.4",
    "inquirer": "^9.2.7"
  }
}
```
Ahora solo resta ejecuta en la terminal el siguiente comando: 
```
npm start
```
# Uso de nodemon