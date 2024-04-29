module.exports = {
    routes : [
        {
            method: 'POST',
            path: '/findProductoByNombre',
            handler: 'producto.findProductoByNombre',
            confing: {
                auth: false
            }
        }
    ]
}