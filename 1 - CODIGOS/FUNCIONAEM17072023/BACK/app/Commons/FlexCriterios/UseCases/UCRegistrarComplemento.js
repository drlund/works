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
  OPTS_STR,
  PARECER_STRING,
} = require("../Constants");
const Manifestacao = require("../Entidades/Manifestacao");

class UcRegistrarComplemento extends AbstractUserCase {
  async _checks(manifestacao) {
    if (
      manifestacao.parecer == PARECER.DESFAVORAVEL &&
      manifestacao.texto.length == 0
    ) {
      throw new ExpectedAbstractError(
        "Obrigatório informar um texto para parecer desfavoravel!",
        404
      );
    }
  }

  async _action(manifestacao) {
    const { solicitacoesRepository, manifestacoesRepository } = this.repository;
    let dadosConsulta;
    //Formatação da manifestação pra salvar.
    const dadosManifestacao =
      Manifestacao.transformEditarManifestacao(manifestacao);

    if (manifestacao.parecer == PARECER.FAVORAVEL) {
      dadosManifestacao.parecer = PARECER_STRING.FAVORAVEL;
      dadosConsulta =
        await manifestacoesRepository.atualizarComplementoPendente(
          manifestacao.idComplemento,
          dadosManifestacao,
          this.trx
        );
      //

      if (!dadosConsulta) {
        throw new ExpectedAbstractError(
          "Você não está autorizado, ou já se manifestou nesta solicitação de flexibilização!",
          403
        );
      }

      // verificar se existe manifestações pendentes
      const manifestacoesPendentes =
        await manifestacoesRepository.temManifestacaoPendente(
          dadosManifestacao.id_solicitacao,
          this.trx
        );
      //
      if (!manifestacoesPendentes) {
        const novaEtapa = {
          id_status: STATUS.ANALISE,
          id_localizacao: LOCALIZACOES.GESTOR,
          id_etapa: ETAPAS.ANALISE,
        };
        await solicitacoesRepository.avancarEtapaSolicitacao(
          dadosManifestacao.id_solicitacao,
          novaEtapa,
          this.trx
        );
      }
    }

    //Case voto desfavorável
    if (manifestacao.parecer == PARECER.DESFAVORAVEL) {
      dadosConsulta =
        await manifestacoesRepository.atualizarManifestacaoDesfavoravel(
          dadosManifestacao,
          manifestacao.usuario,
          this.trx
        );

      if (!dadosConsulta) {
        throw new ExpectedAbstractError(
          "Você não está autorizado a manifestar-se nesta solicitação de flexibilização!",
          403
        );
      }

      const novaEtapa = {
        id_status: STATUS.CANCELADO,
        id_etapa: ETAPAS.FINALIZANDO,
      };
      await solicitacoesRepository.avancarEtapaSolicitacao(
        dadosManifestacao.id_solicitacao,
        novaEtapa,
        this.trx
      );
    }

    return dadosConsulta;
  }
}

module.exports = UcRegistrarComplemento;
