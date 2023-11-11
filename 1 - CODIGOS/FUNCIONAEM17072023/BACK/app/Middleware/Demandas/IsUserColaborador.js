'use strict'
const exception = use('App/Exceptions/Handler');
const isUserColaborador  = use('App/Commons/Demandas/isUserColaborador');

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */

class IsUserColaborador {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle ({ request, session, params }, next) {  
    
    let allParams = {...request.params, ...request.all()};
    let {id, idDemanda} = allParams;

    if (!id && !idDemanda) {
      throw new exception(`Id da demanda não informado`, 400);  
    }

    if (!id) {
      id = idDemanda;
    }

    let dadosUsuario = session.get('currentUserAccount');

    if (!dadosUsuario) {
			throw new exception(`Usuário não está logado! Faça o login e tente novamente.`, 404);  
    }    
    
    let isColaborador = await isUserColaborador({
      idDemanda: id,
      matricula: dadosUsuario.chave,
      dadosUsuario
    });

    if (!isColaborador) {
      throw new exception(`Usuário: ${dadosUsuario.chave} não é colaborador da demanda`, 400);
    }

    return next();
  }

  // TODO Implementar para Web Socket
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async wsHandle ({ request }, next) {
    // call next to advance the request
    await next()

  }
}

module.exports = IsUserColaborador;
