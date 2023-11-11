"use strict";

const { AbstractUserCase } = require("../../AbstractUserCase");

class UCGetAcoes extends AbstractUserCase {
  _checks(_, usuario) {
    if (!usuario) {
      throw new Error("Usuário não informado.");
    }
  }

  async _action() {
    const { acoesRepository } = this.repository;
    const consulta = await acoesRepository.getAcoes();

    return consulta;
  }
}

module.exports = UCGetAcoes;
