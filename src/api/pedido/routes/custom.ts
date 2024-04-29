module.exports = {
    routes : [
        {
            method: 'POST',
            path: '/findPedidoPorCelularDeCliente',
            handler: 'pedido.findPedidoPorCelularDeCliente',
            confing: {
                auth: false
            }
        }
    ]
}