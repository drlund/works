"use strict";

const { AbstractUserCase } = require("../../AbstractUserCase");

class UcCriarQuorumQualquerPrefixo extends AbstractUserCase {
  async _checks(_,__,dadosUsuario) {
    const hasAcessosNecessarios = await this.functions.checkAcessosMovimentacao(
      dadosUsuario,
      ["ADM_QUORUM_QUALQUER"]
    );

    if (!hasAcessosNecessarios) {
      throw new Error("Usuário não possui acessos necessários.");
    }
  }

  async _action(prefixo, quorum,dadosUsuario) {
    try {
      const quorumQualquer = await this.repository.quorumRepository.criarQuorum(
        prefixo,
        quorum,
        dadosUsuario.matricula
      );
      return quorumQualquer;
    } catch (error) {
      this._throwExpectedError("Erro ao gravar prefixo, possível duplicidade.");
    }
  }
}

module.exports = UcCriarQuorumQualquerPrefixo;
