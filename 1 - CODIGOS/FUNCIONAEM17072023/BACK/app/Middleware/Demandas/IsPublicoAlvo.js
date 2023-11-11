
'use strict'
const exception = use('App/Exceptions/Handler');
const isPublicoAlvo  = use('App/Commons/Demandas/isPublicoAlvo');

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */

class IsPublicoAlvo {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle ({ session,request,response,params }, next) {  

    let {id, idDemanda} = request.allParams();

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
                              
    let matricula = dadosUsuario.chave;
    let prefixo = dadosUsuario.prefixo;
    let isPublicoAlvoPorMatricula = await isPublicoAlvo({matricula, idDemanda: id});
    let isPublicoAlvoPorPrefixo = await isPublicoAlvo({prefixo, idDemanda: id});

    if (!isPublicoAlvoPorMatricula && !isPublicoAlvoPorPrefixo) {
			throw new exception(`Usuário: ${dadosUsuario.chave} do prefixo: ${dadosUsuario.prefixo} não é público alvo da demanda id: ${id}`, 400);  
    }

    await next();
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

module.exports = IsPublicoAlvo;
