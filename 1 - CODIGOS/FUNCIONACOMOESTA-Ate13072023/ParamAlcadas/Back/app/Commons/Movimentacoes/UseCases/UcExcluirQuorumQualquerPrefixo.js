"use strict";

const { AbstractUserCase } = require("../../AbstractUserCase");

class UcExcluirQuorumQualquerPrefixo extends AbstractUserCase {
  async _checks(_, dadosUsuario) {
    const hasAcessosNecessarios = await this.functions.checkAcessosMovimentacao(
      dadosUsuario,
      ["ADM_QUORUM_QUALQUER"]
    );

    if (!hasAcessosNecessarios) {
      throw new Error("Usuário não possui acessos necessários.");
    }
  }

  async _action(prefixo, dadosUsuario) {
    return await this.repository.quorumRepository.excluirQuorum(
      prefixo,
      dadosUsuario.matricula
    );
  }
}

module.exports = UcExcluirQuorumQualquerPrefixo;
