/**
 * producto controller
 */

import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::producto.producto', ({ strapi }) => ({
  async findProductoByNombre(ctx) {
    try {
        const { nombre } = ctx.request.body;

        if(!nombre) {
            ctx.response.status = 400;
            ctx.response.body = {
                error: 'Falta el nombre del producto'
            }
        }

        const producto = await strapi.db.query('api::producto.producto').findOne({
            where: {
                nombre: {$containsi: nombre}
            }
        });

        if(!producto) {
            ctx.response.status = 404;
            ctx.response.body = {
                error: 'No se encontro el cliente'
            }
        }

        ctx.response.status = 200;
        ctx.response.body = {
            data: producto
        }
    } catch (error) {
        console.log(error);
        ctx.response.status = 500;
        ctx.response.body = {
            error: error,
            message: 'Error al buscar el producto'
        }
    }
  }
}));
