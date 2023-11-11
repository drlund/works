const { AbstractUserCase } = require('../../../AbstractUserCase');

class UcSoftDeleteMinuta extends AbstractUserCase {
  async _action(id) {
    const deleteTry = await this.repository.softDeleteMinutaCadastradaNoTrx(id);

    const deleteOk = deleteTry === 1;

    if (deleteOk) {
      return 'ok';
    }

    return this._throwExpectedError("Minuta não encontrada.", 404);
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

module.exports = UcSoftDeleteMinuta;
