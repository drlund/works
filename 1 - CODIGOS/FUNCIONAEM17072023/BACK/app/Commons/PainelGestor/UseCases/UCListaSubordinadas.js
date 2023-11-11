"use strict";

const { AbstractUserCase } = use(
  "App/Commons/AbstractUserCase/AbstractUserCase"
);

class UCListaSubordinadas extends AbstractUserCase {
  _checks(prefixo) {
    if (!prefixo) {
      throw new Error("Obrigatório informar o prefixo.");
    }
  }

  async _action(prefixo) {
    const lista = await this.repository.getListaSubordinadas(prefixo);
    return lista;
  }
}

module.exports = UCListaSubordinadas;
