"use strict";

const { AbstractUserCase } = require("../../AbstractUserCase");

const { STATUS, LOCALIZACOES, ETAPAS } = require("../Constants");

class UCRemoverDeferidorPorDiretoria extends AbstractUserCase {
  async _checks() {}

  async _action(despacho) {
    const { solicitacoesRepository, manifestacoesRepository } = this.repository;

    /*   console.log(despacho);
    throw new Error("Error"); */
    await manifestacoesRepository.deleteDeferimentosByDiretoriaESolicitacao(
      despacho.idSolicitacao,
      despacho.diretoria
    );
  }
}

module.exports = UCRemoverDeferidorPorDiretoria;
