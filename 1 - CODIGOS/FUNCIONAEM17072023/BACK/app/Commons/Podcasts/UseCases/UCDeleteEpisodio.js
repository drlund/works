"use strict";
const { AbstractUserCase } = require('../../AbstractUserCase');
class UCDeleteEpisodio extends AbstractUserCase {
  async _checks(id, user) {
    const isAdministradorEpisodios = await this.functions.hasPermission({
      nomeFerramenta: "Podcasts",
      dadosUsuario: user,
      permissoesRequeridas: ["GERENCIAR"],
    });
    if (!isAdministradorEpisodios) {
      throw new Error(
        "Você não tem permissão para acessar esta funcionalidade."
      );
    }
  }

  async _action(id) {
    return this.repository.deleteEpisodio(id);
  }
}

module.exports = UCDeleteEpisodio;
