module.exports = {
    routes : [
        {
            method: 'POST',
            path: '/findPedidoPorCelular',
            handler: 'pedido.findPedidoPorCelular',
            confing: {
                auth: false
            }
        }
    ]
}