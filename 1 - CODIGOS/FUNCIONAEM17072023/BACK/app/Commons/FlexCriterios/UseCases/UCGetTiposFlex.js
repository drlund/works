"use strict";

const { AbstractUserCase } = require("../../AbstractUserCase");

class UCGetTiposFlex extends AbstractUserCase {
  _checks(_, usuario) {
    if (!usuario) {
      throw new Error("Necessário estar logado");
    }
  }

  async _action() {
    const { tiposRepository } = this.repository;

    const dadosConsulta = await tiposRepository.getTipos();

    return dadosConsulta;
  }
}

module.exports = UCGetTiposFlex;
