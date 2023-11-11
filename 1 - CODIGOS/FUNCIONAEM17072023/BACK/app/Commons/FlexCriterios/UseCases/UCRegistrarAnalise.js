"use strict";

const {
  AbstractUserCase,
  ExpectedAbstractError,
} = require("../../AbstractUserCase");
const {
  ACOES,
  STATUS,
  LOCALIZACOES,
  ETAPAS,
  SITUACOES,
  PARECER,
  PARECER_STRING,
} = require("../Constants");
const Manifestacao = require("../Entidades/Manifestacao");

class UCRegistrarAnalise extends AbstractUserCase {
  async _checks(analise) {
    const podeAnalisarSolicitacao = await this.functions.hasPermission({
      nomeFerramenta: "Flex Critérios",
      dadosUsuario: analise.usuario,
      permissoesRequeridas: ["ANALISTA", "ROOT"],
    });
    /*     if (!podeAnalisarSolicitacao) {
      throw new Error(
        "Você não tem permissão para analisar a solicitação informada"
      );
    } */
  }

  async _action(analise) {
    const { solicitacoesRepository, manifestacoesRepository } = this.repository;
    const dadosAnalise = Manifestacao.transformNovaAnalise(analise);
    const ordemManifestacaoAtual = await manifestacoesRepository.getOrdemManif(
      dadosAnalise.id_solicitacao,
      this.trx
    );

    const existemComplementosPendentesParaAnalise =
      await manifestacoesRepository.getCompAnalisePend(
        dadosAnalise.id_solicitacao,
        this.trx
      );

    if (existemComplementosPendentesParaAnalise) {
      this._throwExpectedError(
        "Existem complementos pendentes de análise, responda-os antes de realizar a análise."
      );
    }

    if (analise.parecer == PARECER.DESFAVORAVEL) {
      dadosAnalise.id_situacao = SITUACOES.NAO_VIGENTE;
      dadosAnalise.ordemManifestacao = ordemManifestacaoAtual + 1;
      await manifestacoesRepository.novaAnalise(dadosAnalise, this.trx);
      await solicitacoesRepository.cancelarSolicitacao(
        analise.idSolicitacao,
        this.trx
      );
      return dadosAnalise.id_solicitacao;
    }

    // Se parecer = 1

    dadosAnalise.id_situacao = SITUACOES.REGISTRADA;
    dadosAnalise.parecer = PARECER_STRING.FAVORAVEL;
    dadosAnalise.ordemManifestacao = ordemManifestacaoAtual + 1;

    await manifestacoesRepository.novaAnalise(dadosAnalise, this.trx);

    const novaEtapa = {
      id_status: STATUS.DESPACHO,
      id_localizacao: LOCALIZACOES.GESTOR,
      id_etapa: ETAPAS.DESPACHO,
    };

    await solicitacoesRepository.avancarEtapaSolicitacao(
      dadosAnalise.id_solicitacao,
      novaEtapa,
      this.trx
    );

    return dadosAnalise.id_solicitacao;
  }
}

module.exports = UCRegistrarAnalise;
