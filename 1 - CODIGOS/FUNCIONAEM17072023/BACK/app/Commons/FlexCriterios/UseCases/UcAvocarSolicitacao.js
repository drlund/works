"use strict";

const {
  AbstractUserCase,
  ExpectedAbstractError,
} = require("../../AbstractUserCase");
const { dadoscapacitacao } = require("../../PainelGestor/Mock");
const {
  ACOES,
  STATUS,
  LOCALIZACOES,
  ETAPAS,
  PARECER,
} = require("../Constants");
const Manifestacao = require("../Entidades/Manifestacao");
const Solicitacao = require("../Entidades/Solicitacao");

class UcAvocarSolicitacao extends AbstractUserCase {
  _checks() {
    //somente analista/despachante pode avocar
    /* throw new ExpectedAbstractError(
      "Caindo no useCase UcAvocarSoliticação!",
      400
    ); */
  }

  async _action(manifestacao) {
    const { solicitacoesRepository, manifestacoesRepository } = this.repository;

    await manifestacoesRepository.avocarSolicitacao(
      manifestacao.idSolicitacao,
      manifestacao.idDispensa,
      manifestacao.usuario,
      this.trx
    );

    const novaEtapa = {
      id_status: STATUS.ANALISE,
      id_etapa: ETAPAS.ANALISE,
    };
    await solicitacoesRepository.avancarEtapaSolicitacao(
      manifestacao.idSolicitacao,
      novaEtapa,
      this.trx
    );
  }
}

module.exports = UcAvocarSolicitacao;
