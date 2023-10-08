const path = require('path')
const { v4: uuidv4 } = require('uuid');

const subirArchivo = (files, extensionesValidas = ['png', 'jpg', 'jpeg', 'gif'], carpeta = '') => {
    return new Promise((resolve, reject) => {
        // Extraemos el archivo para manejarlo
        const { archivo } = files;
        // Separar el nombre del archivo por ( . )
        const nombreCortado = archivo.name.split('.')
        // Obtener la extencion del archivo
        const extension = nombreCortado[nombreCortado.length - 1]
        // Validar la extension del archivo
        if (!extensionesValidas.includes(extension)) {
            return reject(`La extensión ${extension} no es permitida - ${extensionesValidas}`)
        }
        // Remonbrar archivo 
        const nombreTemp = uuidv4() + '.' + extension
        // Ruta para colocar el archivo
        const uploadPath = path.join(__dirname, '../uploads/', carpeta, nombreTemp);
        // Mover el archivo a la ruta indicada
        archivo.mv(uploadPath, (err) => {
            if (err) {
                reject(err)
            }
            resolve(nombreTemp)
        });
    })
}
module.exports = {
    subirArchivo
}