"use strict";

const { AbstractUserCase } = require("../../AbstractUserCase");

class UCGetEtapas extends AbstractUserCase {
  _checks(_, usuario) {
    if (!usuario) {
      throw new Error("Necessário estar logado.");
    }
  }

  async _action() {
    const { etapasRepository } = this.repository;
    const consulta = await etapasRepository.getEtapas();

    return consulta;
  }
}

module.exports = UCGetEtapas;
