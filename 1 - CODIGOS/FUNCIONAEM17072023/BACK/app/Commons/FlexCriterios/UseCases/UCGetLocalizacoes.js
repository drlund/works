"use strict";

const { AbstractUserCase } = require("../../AbstractUserCase");

class UCGetLocalizacoes extends AbstractUserCase {
  _checks(_, usuario) {
    if (!usuario) {
      throw new Error("Necessário estar logado.");
    }
  }

  async _action() {
    const { localizacoesRepository } = this.repository;
    const consulta = await localizacoesRepository.getLocalizacoes();

    return consulta;
  }
}

module.exports = UCGetLocalizacoes;
