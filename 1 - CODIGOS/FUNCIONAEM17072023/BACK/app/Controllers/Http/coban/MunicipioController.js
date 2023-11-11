'use strict'

const Municipio = use("App/Models/Mysql/coban/Municipio");

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with municipios
 */
class MunicipioController {
  /**
   * Show a list of all municipios.
   * GET municipios
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
   * Create/save a new municipio.
   * POST municipios
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request, response }) {
  }

  /**
   * Display a single municipio.
   * GET municipios/:id
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
      .where('municipio', 'like', `${municipio}%`)
      .fetch();

    let municipios = municipiosQuery.toJSON();

    return municipios;
  }

  /**
   * Update municipio details.
   * PUT or PATCH municipios/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response }) {
  }

  /**
   * Delete a municipio with id.
   * DELETE municipios/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, request, response }) {
  }
}

module.exports = MunicipioController
