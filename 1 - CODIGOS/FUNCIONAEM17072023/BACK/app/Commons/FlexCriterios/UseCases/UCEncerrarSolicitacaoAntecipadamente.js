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

class UCEncerrarSolicitacaoAntecipadamente extends AbstractUserCase {
  _checks(props) {
    /*  throw new ExpectedAbstractError(
      "Caindo no useCase UCEncerrarSolicitacaoAntecipadamente!",
      400
    ); */
  }

  async _action(manifestacao) {
    const { solicitacoesRepository, manifestacoesRepository } = this.repository;

    //Case voto desfavorável
    if (manifestacao.parecer == PARECER.DESFAVORAVEL) {
      await manifestacoesRepository.encerraSolicitacaoAntecipadamente(
        manifestacao.idSolicitacao,
        manifestacao.idDispensa,
        manifestacao.usuario,
        this.trx
      );

      const novaEtapa = {
        id_status: STATUS.CANCELADO,
        id_etapa: ETAPAS.ENCERRADO,
      };
      await solicitacoesRepository.avancarEtapaSolicitacao(
        manifestacao.idSolicitacao,
        novaEtapa,
        this.trx
      );
    }

    return;
  }
}

module.exports = UCEncerrarSolicitacaoAntecipadamente;
