module.exports = {
    routes : [
        {
            method: 'POST',
            path: '/findClienteByName',
            handler: 'cliente.findClienteByName',
            confing: {
                auth: false
            }
        }
    ]
}