"use strict";

const { AbstractUserCase } = require("../../AbstractUserCase");

class UCGetDadosEscalao extends AbstractUserCase {
  _checks(_, usuario) {
    if (!usuario) {
      throw new Error("Necessário estar logado.");
    }
  }

  async _action(prefixo) {
    const { escaloesRepository } = this.repository;

    const dadosConsulta = await escaloesRepository.getDadosEscalao(prefixo);

    return dadosConsulta;
  }
}

module.exports = UCGetDadosEscalao;
