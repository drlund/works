"use strict";

const { AbstractUserCase } = require("../../AbstractUserCase");

class UcRecuperarQuorumTodosPrefixos extends AbstractUserCase {
  async _checks(dadosUsuario) {
    const hasAcessosNecessarios = await this.functions.checkAcessosMovimentacao(
      dadosUsuario,
      ["ADM_QUORUM_QUALQUER"]
    );

    if (!hasAcessosNecessarios) {
      throw new Error("Usuário não possui acessos necessários.");
    }
  }

  async _action() {
    const quoruns = await this.repository.quorumRepository.recuperarQuorum();
    return quoruns;
  }
}

module.exports = UcRecuperarQuorumTodosPrefixos;
