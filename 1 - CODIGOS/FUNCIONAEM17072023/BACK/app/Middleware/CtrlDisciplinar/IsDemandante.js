'use strict'
const hasPermission = use('App/Commons/HasPermission');

const DIPES = "8559";
const GEPESPR = "8931";

class IsDemandante {

  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle ({ session, request, response }, next) {

    try {
      let dadosUsuario = session.get('currentUserAccount');

      if (!dadosUsuario) {
          throw new Exception('Dados do usuário não fornecido. Faça login novamente.');
      }

      if (dadosUsuario) {
        request.temPermissaoVisualizar = await hasPermission({
            nomeFerramenta: 'Controle Disciplinar',
            dadosUsuario,
            permissoesRequeridas: ['VISUALIZAR']
        });
        request.temPermissaoAtualizar = await hasPermission({
          nomeFerramenta: 'Controle Disciplinar',
          dadosUsuario,
          permissoesRequeridas: ['ATUALIZAR']
      });
    }

      if (dadosUsuario.prefixo === DIPES || dadosUsuario.prefixo === GEPESPR) {
        request.isPrefsPessoas = true;
      } else {
        request.isPrefsPessoas = false;
      }

      await next();

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

module.exports = IsDemandante;