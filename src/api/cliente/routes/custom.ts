module.exports = {
    routes : [
        {
            method: 'POST',
            path: '/findClienteByName',
            handler: 'cliente.findClienteByName',
            confing: {
                auth: false
            }
        },
        {
            method: 'POST',
            path: '/findClienteByCelular',
            handler: 'cliente.findClienteByCelular',
            confing: {
                auth: false
            }
        }
    ]
}