'use strict'
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const exception = use('App/Exceptions/Handler')
const hasPermission = use('App/Commons/HasPermission')

class allowed {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle ({ request, session }, next, properties) {
    const TIPO_CHECAGEM = properties[0]
    properties.shift();
    const NOME_FERRAMENTA = properties[0];
    properties.shift();

    let verificarTodas = null;
    switch (TIPO_CHECAGEM) {
      case 'AND':
        verificarTodas = true;
        break;
      case 'OR':
        verificarTodas = false;
        break;

      default:
        throw new exception(`allowed: Só foram implementadas as checagens AND e OR`, 500, 'INVALID_PARAMETER');
    }

    const PERMISSOES_REQUERIDAS = [...properties];

    const possuiAcesso = await hasPermission({
      nomeFerramenta: NOME_FERRAMENTA,
      dadosUsuario: session.get('currentUserAccount'),
      permissoesRequeridas: PERMISSOES_REQUERIDAS,
      verificarTodas
    })

    if(!possuiAcesso){
      throw new exception(`allowed: Funcionário ${session.get('currentUserAccount').chave} não possui a(s) permissão(ões) ${PERMISSOES_REQUERIDAS.join(',')}`, 403, 'MISSING_PERMISSION');
    }
    // call next to advance the request
    await next()
  }
}

module.exports = allowed
