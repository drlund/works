"use strict";

const { AbstractUserCase } = require("../../AbstractUserCase");

const {
  ACOES,
  STATUS,
  LOCALIZACOES,
  ETAPAS,
  SITUACOES,

  PARECER_STRING,
} = require("../Constants");

class UCAvancarForcado extends AbstractUserCase {
  async _checks() {}

  async _action(despacho) {
    const { solicitacoesRepository, manifestacoesRepository } = this.repository;
    let novaEtapa;
    const temOperador =
      await manifestacoesRepository.algumTipoSolicitacaoTemOperador(
        despacho.idSolicitacao,
        this.trx
      );

    const temPendente = await manifestacoesRepository.temDeferimentoPendente(
      despacho.idSolicitacao,
      this.trx
    );

    if (temPendente.length > 0) {
      novaEtapa = {
        id_status: STATUS.DEFERIMENTO,
        id_localizacao: LOCALIZACOES.DIRETORIA,
        id_etapa: ETAPAS.DEFERIMENTO,
      };
    } else {
      if (temOperador) {
        novaEtapa = {
          id_status: STATUS.FINALIZANDO,
          id_localizacao: LOCALIZACOES.GEPES,
          id_etapa: ETAPAS.FINALIZANDO,
        };
      } else {
        novaEtapa = {
          id_status: STATUS.ENCERRADO,
          id_localizacao: LOCALIZACOES.DIRETORIA,
          id_etapa: ETAPAS.ENCERRADO,
        };
      }
    }

    return await solicitacoesRepository.avancarEtapaSolicitacao(
      despacho.idSolicitacao,
      novaEtapa,
      this.trx
    );
  }
}

module.exports = UCAvancarForcado;
