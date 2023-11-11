"use strict";
const { AbstractUserCase } = require('../../AbstractUserCase');

class UcGetCanalById extends AbstractUserCase {
  async _action(id) {
    const canal = await this.repository.getCanalById(id);

    if (!canal) {
      return this._throwExpectedError("Canal não encontrado", 404);
    }

    return canal;
  }

  _checks(id) {
    if (!id || id.length === 0) {
      throw new Error("O id não pode ser vazio");
    }

    if (typeof id !== "string") {
      throw new Error("O id precisa ser string");
    }
  }
}

module.exports = UcGetCanalById;
