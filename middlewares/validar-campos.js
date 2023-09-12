const { validationResult } = require('express-validator')

// Verifica Validaciones de /routes
const validarCampos = (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json(errors)
    }
    //  Para que el controlador continue su ejecución
    next()
}
module.exports = {
    validarCampos
}