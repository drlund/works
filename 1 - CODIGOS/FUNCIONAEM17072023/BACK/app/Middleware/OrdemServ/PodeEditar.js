'use strict'
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const podeEditarOrdem = use('App/Commons/OrdemServ/podeEditarOrdem');
const exception = use('App/Exceptions/Handler');

class PodeEditar {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle ({ request, session }, next) {
    let { id } = request.allParams();

    if (!id) {
      //se nao passou id eh porque deseja salvar os dados de uma ordem já criada
      //anteriormente, verifica o id pelos dados básicos
      let {dadosOrdem} = request.allParams();
      let { dadosBasicos } = dadosOrdem;

      if (!dadosBasicos.id) {
        throw new exception(`Id da ordem não informado`, 400);
      }

      id = dadosBasicos.id;
    }

    let dadosUsuario = session.get('currentUserAccount');
    let podeEditar = await podeEditarOrdem(id, dadosUsuario.chave);

    if (!podeEditar.result) {
      throw new exception(podeEditar.motivo, 400);
    }

    // call next to advance the request
    await next()
  }
}

module.exports = PodeEditar
