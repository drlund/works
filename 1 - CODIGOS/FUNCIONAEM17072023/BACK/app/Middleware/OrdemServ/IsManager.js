'use strict'
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const hasPermission = use('App/Commons/HasPermission');
const podeVisualizarOrdem = use('App/Commons/OrdemServ/podeVisualizarOrdem');
const exception = use('App/Exceptions/Handler');

class IsManager {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle ({ request, session }, next, properties) {
    const { id } = request.allParams();

    if (!id && !properties.includes('only')) {
      throw new exception(`Id da ordem não informado`, 400);  
    }

    let dadosUsuario = session.get('currentUserAccount');

    if (!dadosUsuario) {
      throw new exception("Dados do usuário não fornecido. Faça login novamente.", 400);
    }

    const possuiAcesso = await hasPermission({ 
        nomeFerramenta: 'Ordem de Serviço', 
        dadosUsuario, 
        permissoesRequeridas: ['GERENCIAR', 'ADMIN']
    });

    if (!possuiAcesso) {
      if (properties.includes('only')) {
        //o parametro only verifica apenas as permissoes.
        throw new exception("Você não possui permissão para a ação solicitada!", 400);
      } else {
        let userRoles = dadosUsuario.roles ? dadosUsuario.roles : [];
        let podeVisualizar = await podeVisualizarOrdem(id, dadosUsuario.chave, dadosUsuario.prefixo, true, userRoles);

        if (!podeVisualizar.result) {
          throw new exception(podeVisualizar.motivo || "Você não possui permissão para visualizar os dados desta ordem!", 400);
        }
      }
    }

    // call next to advance the request
    await next()
  }
}

module.exports = IsManager