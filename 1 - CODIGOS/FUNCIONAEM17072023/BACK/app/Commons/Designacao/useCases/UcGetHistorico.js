"use strict";

const { AbstractUserCase } = require("../../AbstractUserCase");

class UcGetHistorico extends AbstractUserCase{

  async _action({
    id
  }) {
    const { solicitacaoRepository } = this.repository;

    const solicitacao  = await solicitacaoRepository.getOneSolicitacao(id);

    return solicitacao.historico;
  }

  _checks ({
    id,
  }) {
    if (!id) throw { message: "A id da solicitação deve ser informada", status: 400 };
  }

}


module.exports = UcGetHistorico;