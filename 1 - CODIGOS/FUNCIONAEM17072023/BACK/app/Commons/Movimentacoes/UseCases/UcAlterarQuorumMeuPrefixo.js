"use strict";

const { AbstractUserCase } = require("../../AbstractUserCase");

class UcAlterarQuorumMeuPrefixo extends AbstractUserCase {
  async _checks(_, dadosUsuario) {
    const hasAcessosNecessarios = await this.functions.checkAcessosMovimentacao(
      dadosUsuario,
      ["ADM_QUORUM_QUALQUER", "ADM_QUORUM_PROPRIO"]
    );

    if (!hasAcessosNecessarios) {
      throw new Error("Usuário não possui acessos necessários.");
    }
  }

  async _action(quorum, dadosUsuario) {
    const quorumAlterado = await this.repository.quorumRepository.alterarQuorum(
      dadosUsuario.prefixo,
      quorum,
      dadosUsuario.matricula
    );
    return quorumAlterado;
  }
}

module.exports = UcAlterarQuorumMeuPrefixo;
