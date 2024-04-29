/**
 * pedido controller
 */

import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::pedido.pedido', ({ strapi }) => ({
  async create(ctx) {
    try {
        const { fechaPedido, cliente, estado, Productos } = ctx.request.body;

        if(!fechaPedido || !cliente || !estado || !Productos) {
            ctx.response.status = 400;
            ctx.response.body = {
                message: 'Faltan datos'
            }
            return;
        }

        const pedidoPendientes = await strapi.db.query('api::pedido.pedido').findMany({
            where: {
                estado: {$eqi: 'pendiente'}
            }
        });

        if(pedidoPendientes) {
            ctx.response.status = 400;
            ctx.response.body = {
                message: 'Ya hay un pedido pendiente'
            }
            return;
        }

        const pedido = await strapi.db.query('api::pedido.pedido').create({
            data: {
                fechaPedido,
                cliente,
                estado,
                Productos
            }
        });

        ctx.response.status = 201;
        ctx.response.body = {
            message: 'Pedido creado',
            data: pedido
        }

    } catch (error) {
        console.log(error);
        ctx.response.status = 500;
        ctx.response.body = {
            error: error,
            message: 'Error en el servidor'
        }
    }
  }
}));
