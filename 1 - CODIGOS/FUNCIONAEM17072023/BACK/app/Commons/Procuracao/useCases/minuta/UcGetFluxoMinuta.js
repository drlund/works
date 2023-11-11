const { AbstractUserCase } = require('../../../AbstractUserCase');

class UcGetFluxoMinuta extends AbstractUserCase {
  constructor(...params) {
    // @ts-ignore
    super(...params);
    this._config({ usePayload: false });
  }

  async _action(id) {
    if (id) {
      return this.repository.getOneFluxoMinuta(id);
    }

    return this.repository.getFluxosMinuta();
  }

  _checks(id) {
    if (!id && (id !== null && id !== undefined)) {
      throw new Error("ID é necessário.");
    }
  }
}

module.exports = UcGetFluxoMinuta;
