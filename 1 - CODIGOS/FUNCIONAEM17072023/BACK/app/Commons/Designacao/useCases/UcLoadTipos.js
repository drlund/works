"use strict";

const { AbstractUserCase } = require("../../AbstractUserCase");

class UcLoadTipos extends AbstractUserCase {

  async _action() {
    const { tiposRepository } = this.repository;
    const resultado = await tiposRepository.getAll();

    return resultado;
  }

  _checks({
    tipos
  }) {
    if (!tipos) throw { message: "Os tipos devem ser informados", status: 400 };
  }
}

module.exports = UcLoadTipos;
