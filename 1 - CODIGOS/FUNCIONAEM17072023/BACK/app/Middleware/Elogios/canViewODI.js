
'use strict'
const exception = use('App/Exceptions/Handler')

const hasPermission = use('App/Commons/HasPermission')
const NOME_FERRAMENTA = 'Elogios';
const PERMISSOES_REQUERIDAS = ['VER_HISTORICO_ODI'];

/**
*   Verificar se o usuário possui a permissão 'REGISTRAR_ELOGIO' para a ferramenta Elogios
*
 */


/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */

class CanViewODI {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle ({ session }, next) {

    const possuiAcesso = await hasPermission({
      nomeFerramenta: NOME_FERRAMENTA,
      dadosUsuario: session.get('currentUserAccount'),
      permissoesRequeridas: PERMISSOES_REQUERIDAS
    });

    if(!possuiAcesso){
      throw new exception(`canViewODI: Funcionário ${session.get('currentUserAccount').chave} não possui a(s) permissão(ões) ${PERMISSOES_REQUERIDAS.join(',')}`, 400, 'MISSING_PERMISSION');
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

module.exports = CanViewODI;
