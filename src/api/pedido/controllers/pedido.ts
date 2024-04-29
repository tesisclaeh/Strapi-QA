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
  },

  async findPedidoPorCelularDeCliente(ctx) {
    try {
        const { celular } = ctx.request.body;

        if(!celular) {
            ctx.response.status = 400;
            ctx.response.body = {
                error: 'Falta el celular'
            }
            return;
        }

        const cliente = await strapi.db.query('api::cliente.cliente').findOne({
            where: {
                celular
            }
        });

        if(!cliente) {
            ctx.response.status = 400;
            ctx.response.body = {
                error: 'No hay un cleinte con ese celular'
            }
            return; 
        }

        const pedidoActivo = await strapi.db.query('api::pedido.pedido').findOne({
            where: {
                cliente: {$eqi: cliente.id},
                estado: {$eqi: 'pendiente'}
            }
        });

        if(!pedidoActivo) {
            ctx.response.status = 400;
            ctx.response.body = {
                error: 'El cliente no tiene un pedido por el cual pagar'
            }
            return;
        }

        ctx.response.status = 200;
        ctx.response.body = {
            data: pedidoActivo
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
