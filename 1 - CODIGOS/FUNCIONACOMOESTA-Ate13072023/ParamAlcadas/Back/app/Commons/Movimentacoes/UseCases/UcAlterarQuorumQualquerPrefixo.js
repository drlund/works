"use strict";

const { AbstractUserCase } = require("../../AbstractUserCase");

class UcAlterarQuorumQualquerPrefixo extends AbstractUserCase {
  async _checks(_, __, dadosUsuario) {
    const hasAcessosNecessarios = await this.functions.checkAcessosMovimentacao(
      dadosUsuario,
      ["ADM_QUORUM_QUALQUER"]
    );

    if (!hasAcessosNecessarios) {
      throw new Error("Usuário não possui acessos necessários.");
    }
  }

  async _action(prefixo, quorum, dadosUsuario) {
    const quorumAlterado = await this.repository.quorumRepository.alterarQuorum(
      prefixo,
      quorum,
      dadosUsuario.matricula
    );
    return quorumAlterado;
  }
}

module.exports = UcAlterarQuorumQualquerPrefixo;
