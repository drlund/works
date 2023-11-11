"use strict";
const { AbstractUserCase } = require('../../AbstractUserCase');
class UCDeleteCanal extends AbstractUserCase {
  async _checks(id, user) {
    const isAdministradorCanais = await this.functions.hasPermission({
      nomeFerramenta: "Podcasts",
      dadosUsuario: user,
      permissoesRequeridas: ["GERENCIAR"],
    });
    if (!isAdministradorCanais) {
      throw new Error(
        "Você não tem permissão para acessar esta funcionalidade."
      );
    }
  }

  async _action(id) {
    return this.repository.deleteCanal(id);
  }
}

module.exports = UCDeleteCanal;
