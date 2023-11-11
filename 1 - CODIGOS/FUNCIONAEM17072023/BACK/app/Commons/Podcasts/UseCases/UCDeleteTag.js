"use strict";
const { AbstractUserCase } = require('../../AbstractUserCase');

class UCDeleteTag extends AbstractUserCase {
  async _checks(id, user) {
    const isAdministradorTags = await this.functions.hasPermission({
      nomeFerramenta: "Podcasts",
      dadosUsuario: user,
      permissoesRequeridas: ["GERENCIAR"],
    });
    if (!isAdministradorTags) {
      throw new Error(
        "Você não tem permissão para acessar esta funcionalidade."
      );
    }
  }

  async _action(id) {
    return this.repository.deleteTag(id);
  }
}

module.exports = UCDeleteTag;
