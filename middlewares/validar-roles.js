const { response, request } = require("express")

// Middleware que forza la existencia de 'ADMIN_ROLE' para continuar
const esAdminRole = (req = request, res = response, next) => {

    if (!req.usuario) {
        return res.status(500).json({
            msg: 'Se quire verificar el role sin validar el token primero'
        })
    }
    // Extraemos {rol, nombre} del usuario
    const { rol, nombre } = req.usuario

    if (rol !== 'ADMIN_ROLE') {
        return res.status(401).json({
            msg: `${nombre} no es administrador - No pude hacer esto`
        })
    }
    next()
}
// Middleware que verifica si tiene alguno de los roles especificados para continuar
const tieneRole = (...roles) => {

    return (req = request, res = response, next) => {

        if (!req.usuario) {
            return res.status(500).json({
                msg: 'Se quire verificar el role sin validar el token primero'
            })
        }
        if(!roles.includes(req.usuario.rol)){
            return res.status(401).json({
                msg: `El servicio requiere uno de estos roles ${roles}`
            })
        }
        next()
    }
}

module.exports = {
    esAdminRole,
    tieneRole
}