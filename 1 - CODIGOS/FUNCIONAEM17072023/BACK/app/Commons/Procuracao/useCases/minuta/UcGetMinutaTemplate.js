const { AbstractUserCase } = require('../../../AbstractUserCase');

class UcGetMinutaTemplate extends AbstractUserCase {
  async _action(id) {
    const template = await this.repository.getMinutaTemplateByFluxo(id);
    if (!template) {
      return this._throwExpectedError("Template não encontrado.", 404);
    }

    return template;
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

module.exports = UcGetMinutaTemplate;
