"use strict";

const { AbstractUserCase } = require("../../AbstractUserCase");

class UCGetStatus extends AbstractUserCase {
  _checks(_, usuario) {
    if (!usuario) {
      throw new Error("Necessário estar logado.");
    }
  }

  async _action() {
    const { statusRepository } = this.repository;
    const consulta = await statusRepository.getStatus();

    return consulta;
  }
}

module.exports = UCGetStatus;
