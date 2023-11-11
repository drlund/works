"use strict";

const { AbstractUserCase } = require("../../AbstractUserCase");

class UCGetSituacoes extends AbstractUserCase {
  _checks(_, usuario) {
    if (!usuario) {
      throw new Error("Necessário estar logado.");
    }
  }

  async _action() {
    const { situacoesRepository } = this.repository;
    const consulta = await situacoesRepository.getSituacoes();

    return consulta;
  }
}

module.exports = UCGetSituacoes;
