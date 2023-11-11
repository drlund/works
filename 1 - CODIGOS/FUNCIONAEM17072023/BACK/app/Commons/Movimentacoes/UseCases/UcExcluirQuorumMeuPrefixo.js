"use strict";

const { AbstractUserCase } = require("../../AbstractUserCase");

class UcExcluirQuorumMeuPrefixo extends AbstractUserCase {
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
    const quorumExcluido = await this.repository.quorumRepository.excluirQuorum(
      dadosUsuario.prefixo,
      dadosUsuario.matricula
    );
    return quorumExcluido;
  }
}

module.exports = UcExcluirQuorumMeuPrefixo;
