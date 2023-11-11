'use strict'
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const exception = use('App/Exceptions/Handler')
const hasPermission = use('App/Commons/HasPermission')
const NOME_FERRAMENTA = 'Autoridades Secex';
const PERMISSOES_REQUERIDAS = ['USUARIO'];

class IsUser {
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
    })

    if (!possuiAcesso) {
      throw new exception(`Funcionário ${session.get('currentUserAccount').chave} não possui acesso ao recurso solicitado!`, 400);
    }

    // call next to advance the request
    await next();

  }
}

module.exports = IsUser
