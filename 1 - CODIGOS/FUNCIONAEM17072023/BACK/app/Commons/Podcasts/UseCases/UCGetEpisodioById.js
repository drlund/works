"use strict";
const { AbstractUserCase } = require('../../AbstractUserCase');

class UcGetEpisodioById extends AbstractUserCase {
  async _action(id) {
    const episodio = await this.repository.getEpisodioById(id);

    if (!episodio) {
      return this._throwExpectedError("Episódio não encontrado", 404);
    }

    return episodio;
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

module.exports = UcGetEpisodioById;
