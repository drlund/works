"use strict";

const { AbstractUserCase } = use("App/Commons/AbstractUserCase/AbstractUserCase.js");

class UCAcesso extends AbstractUserCase {

  _checks(usuario) {
    if (!usuario) {
      throw new Error("Usuário não logado na Intranet.");
    }
  }

  async _action(usuario) {
    let isPilotoVigente = await this.repository.pilotoVigente();
    if (isPilotoVigente) {
      return this.repository.isParticipantePiloto(
        usuario.prefixo
      );
    }

    return true;
  }
}

module.exports = UCAcesso;
