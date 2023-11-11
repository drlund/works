"use strict";
const { STATUS_PARAMETROS } = use("App/Commons/Mtn/ComiteMtn/Constants");

class UcGetAlteracoesParaTratamento {
  constructor(versoesRepository) {
    this.versoesRepository = versoesRepository;
  }

  async run() {
    const versoesParaAlteracao = this.versoesRepository.filtrarVersoes({
      status_versao_id: STATUS_PARAMETROS.ALTERACAO_PENDENTE,
    });

    return versoesParaAlteracao;
  }
}

module.exports = UcGetAlteracoesParaTratamento;
