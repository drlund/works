'use strict';

const AcessoPrefixo = use("App/Models/Mysql/Ambiencia/EventoAcessoPrefixo");

class AcessoPrefixoRepository {
  async getAcessoPrefixo(prefixo, idEvento) {
    const acessoByPrefixo = await AcessoPrefixo.query()
    .where({'prefixo': prefixo, 'idEvento': idEvento})
    .first();

    if(acessoByPrefixo) {
      return acessoByPrefixo.toJSON();
    }
    return acessoByPrefixo;
  }
}

module.exports = AcessoPrefixoRepository;