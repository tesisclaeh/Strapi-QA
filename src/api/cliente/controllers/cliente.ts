/**
 * cliente controller
 */

import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::cliente.cliente', ({ strapi }) => ({
  async findClienteByName(ctx) {
    try {
        let { nombre } = ctx.request.body;

        if(!nombre) {
            ctx.response.status = 400;
            ctx.response.body = {
                error: 'Falta el nombre'
            }
        }

        const cliente = await strapi.db.query('api::cliente.cliente').findOne({
            where: {
                nombre: {$containsi: nombre}
            }
        });

        if(!cliente) {
            ctx.response.status = 404;
            ctx.response.body = {
                error: 'No se encontro el cliente'
            }
        }

        ctx.response.status = 200;
        ctx.response.body = {
            data: cliente
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

  async findClienteByCelular(ctx) {
    try {
        let { celular } = ctx.request.body;

        if(!celular) {
            ctx.response.status = 400;
            ctx.response.body = {
                error: 'Falta el celular'
            }
        }

        const cliente = await strapi.db.query('api::cliente.cliente').findOne({
            where: {
                nombre: {$eq: celular}
            }
        });

        if(!cliente) {
            ctx.response.status = 404;
            ctx.response.body = {
                error: 'No se encontro el cliente'
            }
        }

        ctx.response.status = 200;
        ctx.response.body = {
            data: cliente
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
