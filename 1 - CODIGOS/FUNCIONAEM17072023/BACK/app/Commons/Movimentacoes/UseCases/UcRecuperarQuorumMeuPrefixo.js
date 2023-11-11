"use strict";

const { AbstractUserCase } = require("../../AbstractUserCase");

class UcRecuperarQuorumMeuPrefixo extends AbstractUserCase {
  async _checks(dadosUsuario) {
    const hasAcessosNecessarios = await this.functions.checkAcessosMovimentacao(
      dadosUsuario,
      ["ADM_QUORUM_QUALQUER", "ADM_QUORUM_PROPRIO"]
    );

    if (!hasAcessosNecessarios) {
      throw new Error("Usuário não possui acessos necessários.");
    }
  }

  async _action(dadosUsuario) {
    const quorum = await this.repository.quorumRepository.recuperarQuorum(
      dadosUsuario.prefixo
    );
    return quorum;
  }
}

module.exports = UcRecuperarQuorumMeuPrefixo;
