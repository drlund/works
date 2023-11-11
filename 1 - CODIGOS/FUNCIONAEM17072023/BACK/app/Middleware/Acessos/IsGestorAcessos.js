
'use strict'
const exception = use('App/Exceptions/Handler')

const hasPermission = use('App/Commons/HasPermission')
const NOME_FERRAMENTA = 'Gestão de Acessos';
const PERMISSOES_REQUERIDAS = ['GESTOR_ACESSOS'];

/**
*   Verificar se o usuário possui a permissão 'GESTOR_ACESSOS' para a ferramenta Acessos
*
 */


/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */

class IsGestorAcessos {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle ({ session }, next) {

  
    let possuiAcesso = await hasPermission({
      nomeFerramenta: NOME_FERRAMENTA,
      dadosUsuario: session.get('currentUserAccount'),
      permissoesRequeridas: PERMISSOES_REQUERIDAS
    });

    if(!possuiAcesso){
      throw new exception(`isGestorAcesso: Funcionário ${session.get('currentUserAccount').chave} não possui a(s) permissão(ões) ${PERMISSOES_REQUERIDAS.join(',')}`, 400, 'MISSING_PERMISSION');
    }

    // call next to advance the request
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

module.exports = IsGestorAcessos;
