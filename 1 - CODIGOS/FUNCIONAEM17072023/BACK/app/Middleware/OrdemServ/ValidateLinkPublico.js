'use strict'
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const exception = use('App/Exceptions/Handler');
const ordemModel = use('App/Models/Mysql/OrdemServ/Ordem');

class ValidateLinkPublico {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle ({ request }, next) {
    const { hash, senha } = request.allParams()

    if (!hash) {
      throw new exception("Identificador do link público não informado!", 400)
    }

    if (hash.length < 32) {
      throw new exception("Identificador do link público está inválido!", 400)
    }

    if (!senha) {
      throw new exception("Senha do link público não informada!", 400)
    }

    if (senha.length < 8) {
      throw new exception("Senha do link público com tamanho inválido!", 400)
    }

    //obtem a ordem correspondente
    const ordem = await ordemModel.query()
      .where('hash_link_publico', hash)
      .setVisible(['id', 'senha_link_publico'])
      .first();

    if (!ordem) {
      throw new exception("Ordem de serviço não encontrada para o identificado do link público informado!", 400)
    }
  
    //faz a validacao da senha e informa o erro caso esteja incorreta
    if (senha !== ordem.senha_link_publico) {
      throw new exception("A senha informada está incorreta! Verifique e caso seja necessário procure os responsáveis pela ordem para obter a senha atual.", 400)
    }

    //se achou a ordem preenche o objeto request adequadamente e continua
    request.params = {...request.params, id: ordem.id, withResolucaoVinculos: true}

    // call next to advance the request
    await next()
  }
}

module.exports = ValidateLinkPublico
