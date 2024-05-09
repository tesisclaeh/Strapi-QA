/**
 * pedido controller
 */

import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::pedido.pedido', ({ strapi }) => ({
  async create(ctx) {
    try {
        const { data : { fechaPedido, cliente, estado, Productos, celular, direccion } } = ctx.request.body;


        if(!fechaPedido || !Productos || !celular) {
            ctx.response.status = 400;
            ctx.response.body = {
                message: 'Faltan datos'
            }
            return;
        }

        const pedidoPendientes = await strapi.db.query('api::pedido.pedido').findMany({
            where: {
                estado: {$eqi: 'pendiente'},
                celular: {$eqi: celular}
            }
        });

        if(pedidoPendientes.length > 0) {
            ctx.response.status = 400;
            ctx.response.body = {
                message: 'Usted ya tiene un pedido pendiente, puede modificar su pedido actual o cancelarlo',
                pedidoPendiente: pedidoPendientes
            }
            return;
        }

        // Validar la estructura JSON del pedido
        const { items, total } = Productos;

        if (!Array.isArray(items) || typeof total !== 'number') {
            ctx.response.status = 400;
            ctx.response.body = {
                message: 'Estructura general del pedido incorrecta'
            }
            return;
          }

          for (const item of items) {
            const { id, nombre, precio, cantidad } = item;
      
            if (typeof id !== 'number' || typeof nombre !== 'string' || typeof precio !== 'number' || typeof cantidad !== 'number') {
                ctx.response.status = 400;
                ctx.response.body = {
                    message: 'Estructura de los items incorrecta'
                }
                return;
            }
          }

          let direccionClinete

        if(!direccion) {
            const cli = await strapi.db.query('api::cliente.cliente').findOne({
                where: {
                    celular: { $eqi: celular }
                }
            });

            if(!cli) {
                ctx.response.status = 400;
                ctx.response.body = {
                    message: 'Se requiere una dirección de entrega para el pedido'
                }
                return;
            }

            direccionClinete = cli.direccion
        }

        const pedido = await strapi.db.query('api::pedido.pedido').create({
            data: {
                fechaPedido,
                cliente,
                estado,
                Productos,
                celular,
                direccion: direccion ?? direccionClinete,
                publishedAt: new Date()
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

  async findPedidoPorCelular(ctx) {
    try {
        const { celular } = ctx.request.body;

        if(!celular) {
            ctx.response.status = 400;
            ctx.response.body = {
                error: 'Falta el celular'
            }
            return;
        }

        const pedidoActivo = await strapi.db.query('api::pedido.pedido').findOne({
            where: {
                celular: { $eqi: celular },
                estado: { $eqi: 'pendiente' }
            }
        });

        if(!pedidoActivo) {
            ctx.response.status = 400;
            ctx.response.body = {
                error: 'El cliente no tiene un pedido pendiente por el cual pagar, puede solicitar un nuevo pedido',
                pedidoPendiente: pedidoActivo
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
