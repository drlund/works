'use strict'

const exception = use('App/Exceptions/Handler');
const In = use("App/Models/Mysql/CtrlDisciplinar/In");

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with ins
 */
class InController {

  /**
   * Show a list of all ins.
   * GET ins
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index ({ request, response }) {
    try {
      let ins = await In.query()
          .distinct('CD_ASNT as codAssuntoIn', 'TX_TIT_ASNT as titAssuntoIn')
          .orderBy('CD_ASNT')
          .fetch()

      if (ins) {
        return ins.toJSON()
      }

      return {};
    } catch (error) {
      throw new exception("Problema ao recuperar as INs!", 400);
    }
  }



  /**
   * Display a single in.
   * GET ins/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ request, response }) {
    try {
      const {ins} = request.allParams();
      let normas = await In.query()
          .distinct('CD_ASNT as codAssuntoIn', 'TX_TIT_ASNT as titAssuntoIn')
          .where('CD_ASNT', 'like', `%${ins}%`)
          .orWhere('TX_TIT_ASNT', 'like', `%${ins}%`)
          .orderBy('CD_ASNT')
          .fetch();

      if (normas) {
        return normas.toJSON();
      }

      return {};
    } catch (error) {
      throw new exception("Problema ao recuperar todas a IN!", 400);
    }
  }

}

module.exports = InController
