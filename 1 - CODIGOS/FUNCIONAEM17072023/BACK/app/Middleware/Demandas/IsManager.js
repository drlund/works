'use strict'
const hasPermission = use('App/Commons/HasPermission');

class IsManager {

  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle ({ session, request, response, params }, next) {  
    
    let dadosUsuario = session.get('currentUserAccount');

    if (!dadosUsuario) {
        return response.badRequest('Dados do usuário não fornecido. Faça login novamente.');
    }

    try {
        const possuiAcesso = await hasPermission({ 
            nomeFerramenta: 'Demandas', 
            dadosUsuario, 
            permissoesRequeridas: ['GERENCIAR_DEMANDAS', 'ADMIN']
        });

        if (possuiAcesso) {
            return next();
        }

        return response.badRequest("Você não possui acesso a esta ação!");

    } catch (err) {
        return response.badRequest("Você não possui acesso a esta ação!");
    }
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

module.exports = IsManager;