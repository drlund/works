"use strict"

const { AbstractUserCase } = require("../../AbstractUserCase");

class UcGetListaSolicitacoesConcluidas extends AbstractUserCase {
  async _action() {
    const { solicitacaoRepository } = this.repository;

    const listaSolicitacoesConcluidas = await solicitacaoRepository.getListaSolicitacoesConcluidas();

    return listaSolicitacoesConcluidas;
  }

  _checks() {
    return true;
  }
}

module.exports = UcGetListaSolicitacoesConcluidas;
