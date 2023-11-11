'use strict'

const Coban = use("App/Models/Mysql/coban/Coban");

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with cobans
 */
class CobanController {
  /**
   * Show a list of all cobans.
   * GET cobans
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index ({ request, response }) {
    let allCobans = await Coban.query().with('municipio').fetch();

    let cobans = allCobans.toJSON();

    return cobans;
  }

  /**
   * Create/save a new coban.
   * POST cobans
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request, session }) {

    const dadosUsuario = session.get('currentUserAccount');

    let fields = request.body;
    fields.dados.funci_indic = dadosUsuario.chave;

    let result = await Coban.create(fields.dados);

    return result;
  }

  /**
   * Display a single coban.
   * GET cobans/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params, request, response, view }) {
  }

  /**
   * Update coban details.
   * PUT or PATCH cobans/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response }) {
  }

  /**
   * Delete a coban with id.
   * DELETE cobans/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, request, response }) {
  }

  /**
   * Método que verifica se já houve indicação de cnpj
   * @param {} param0
   */
  async cnpjexiste ({ request, response }) {
    const { cnpj } = request.allParams();

    try {
      const coban = await Coban.query()
        .distinct("cnpj", "excluido")
        .where("cnpj", cnpj)
        .where("excluido", 0)
        .fetch();

        const cob = coban.toJSON();

      return cob;
    } catch {
      return [];
    }
  }
}

module.exports = CobanController
