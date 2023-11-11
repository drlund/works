"use strict";

const { AbstractUserCase } = require("../../AbstractUserCase");

class UCGetComplementacaoPendente extends AbstractUserCase {
  _checks(usuario, idSolicitacao, analise) {
    if (!usuario) {
      throw new Error("Necessário estar logado.");
    }
  }

  async _action(usuario, idSolicitacao, analise) {
    const { manifestacoesRepository } = this.repository;
    let consulta;

    if (analise === "true") {
      consulta =
        await manifestacoesRepository.getTodosComplementoPendenteBySolicitacaoEPrefixo(
          idSolicitacao,
          "0000",
          this.trx
        );
    } else {

      consulta =
        await manifestacoesRepository.getTodosComplementoPendenteBySolicitacaoEPrefixo(
          idSolicitacao,
          usuario.prefixo,
          this.trx
        );
    }

    return consulta;
  }
}

module.exports = UCGetComplementacaoPendente;
