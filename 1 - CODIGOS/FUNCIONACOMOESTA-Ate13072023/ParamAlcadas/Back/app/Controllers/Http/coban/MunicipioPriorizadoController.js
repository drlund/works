'use strict'

const Municipio = use("App/Models/Mysql/coban/MunicipioPriorizado");

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with municipiopriorizados
 */
class MunicipioPriorizadoController {
  /**
   * Show a list of all municipiopriorizados.
   * GET municipiopriorizados
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index ({ request, response, view }) {
    let municipios = await Municipio.all();

    return municipios;
  }

  /**
   * Obtém os códigos dos municípios priorizados.
   * GET municipiopriorizados/codigosIbge
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async codigosIbge ({ request, response }) {
    let municipios = await Municipio.query().select('cd_ibge').fetch();

    return municipios.toJSON();
  }

  /**
   * Create/save a new municipiopriorizado.
   * POST municipiopriorizados
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request, response }) {
  }

  /**
   * Display a single municipiopriorizado.
   * GET municipiopriorizados/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ request, response }) {
    let { municipio } = request.all();

    let municipiosQuery = await Municipio
      .query()
      .where('municipio', 'like', `%${municipio}%`)
      .fetch();

    let municipios = municipiosQuery.toJSON();

    return municipios;
  }

  /**
   * Render a form to update an existing municipiopriorizado.
   * GET municipiopriorizados/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit ({ params, request, response, view }) {
  }

  /**
   * Update municipiopriorizado details.
   * PUT or PATCH municipiopriorizados/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response }) {
  }

  /**
   * Delete a municipiopriorizado with id.
   * DELETE municipiopriorizados/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, request, response }) {
  }
}

module.exports = MunicipioPriorizadoController
