// @ts-check
"use strict";

const { handleAbstractUserCaseError } = require('../../../Commons/AbstractUserCase');

const exception = use("App/Exceptions/Handler");

const {
  UcGetListaFromPesquisa,
  UcGetProcuracao,
} = use("App/Commons/Procuracao/useCases/pesquisar");

const PesquisaRepository = use(
  "App/Commons/Procuracao/repositories/PesquisaRepository"
);


class PesquisaController {
  async pesquisaProcuracao({ request, response }) {
    const { pesquisa, maisRecente } = request.allParams();

    const { error, payload } = await new UcGetListaFromPesquisa({
      repository: new PesquisaRepository()
    }).run(pesquisa, maisRecente)

    handleAbstractUserCaseError(error)

    if (payload.length === 0) {
      throw new exception("Nenhum registro encontrado", 404);
    }

    const primeiraProcuracao = await this._getProcuracao(payload[0]);

    payload[0].procuracao = primeiraProcuracao;

    return response.ok(payload);
  }

  async getProcuracao({ request, response }) {
    const { idProxy, idProcuracao } = request.allParams();

    const procuracao = await this._getProcuracao({ idProxy, idProcuracao });

    return response.ok(procuracao);
  }

  async _getProcuracao({ idProxy, idProcuracao }) {
    const { error, payload } = await new UcGetProcuracao({
      repository: new PesquisaRepository()
    }).run({ idProxy, idProcuracao });

    handleAbstractUserCaseError(error)

    return payload;
  }

}

module.exports = PesquisaController;
