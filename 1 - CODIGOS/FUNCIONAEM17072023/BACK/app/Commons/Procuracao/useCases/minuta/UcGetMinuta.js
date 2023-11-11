const { AbstractUserCase } = require('../../../AbstractUserCase');

class UcGetMinuta extends AbstractUserCase {
  async _action(id) {
    const minuta = await this.repository.getOneMinuta(id);

    if (!minuta) {
      return this._throwExpectedError("Minuta não encontrada.", 404);
    }

    return minuta;
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

module.exports = UcGetMinuta;
