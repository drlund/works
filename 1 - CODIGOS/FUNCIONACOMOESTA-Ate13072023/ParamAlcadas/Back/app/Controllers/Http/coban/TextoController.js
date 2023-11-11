'use strict'

const Texto = use('App/Models/Mysql/coban/Texto');

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with textos
 */
class TextoController {


  /**
   * Create/save a new texto.
   * POST textos
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request, response }) {
  }

  /**
   * Display a single texto.
   * GET textos/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ request, response}) {
    let texto = await Texto.findByOrFail('ativo', 1);

    return texto;
  }

}

module.exports = TextoController
