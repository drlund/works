"use strict";

const { AbstractUserCase } = require("../../AbstractUserCase");

class UcCriarQuorumMeuPrefixo extends AbstractUserCase {
  async _checks(dadosUsuario) {
    const hasAcessosNecessarios = await this.functions.checkAcessosMovimentacao(
      dadosUsuario,
      ["ADM_QUORUM_QUALQUER", "ADM_QUORUM_PROPRIO"]
    );

    if (!hasAcessosNecessarios) {
      throw new Error("Usuário não possui acessos necessários.");
    }
  }

  async _action(quorum, dadosUsuario) {
    try {
      const quorumProprio = await this.repository.quorumRepository.criarQuorum(
        dadosUsuario.prefixo,
        quorum,
        dadosUsuario.matricula
      );
      return quorumProprio;
    } catch (error) {
      this._throwExpectedError("Erro ao gravar prefixo, possível duplicidade.");
    }
  }
}

module.exports = UcCriarQuorumMeuPrefixo;
