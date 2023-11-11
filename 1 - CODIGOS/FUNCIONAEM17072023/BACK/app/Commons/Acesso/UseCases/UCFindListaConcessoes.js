'use strict'
const { AbstractUserCase } = use("App/Commons/AbstractUserCase");

class UCFindTiposAcesso extends AbstractUserCase {
  _checks() { }

  async _action({ativo}) {
    const {
      tiposAcesso,
      concessoesAcessos,
      permissoesFerramentas
    } = this.repository;

    const {
      getDadosIdentificadores
    } = this.functions;

    const concessoes = await concessoesAcessos.findListaConcessoes({ativo});

    if (!concessoes) {
      this._throwExpectedError(
        "Falha ao obter a lista de concessões de acesso no banco de dados!",
        400
      );
    }

    const listaConcessoes = await getDadosIdentificadores(concessoes);

    return listaConcessoes;
  }

}

module.exports = UCFindTiposAcesso;
