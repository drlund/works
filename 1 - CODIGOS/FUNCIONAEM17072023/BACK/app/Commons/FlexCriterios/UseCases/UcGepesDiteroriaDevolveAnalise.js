"use strict";

const {} = require("../../../../start/NamedMiddlewares/CtrlDisciplinar");
const { AbstractUserCase } = require("../../AbstractUserCase");

const {
  STATUS,
  LOCALIZACOES,
  ETAPAS,
  ACOES,
  SITUACOES,
} = require("../Constants");

class UcGepesDiteroriaDevolveAnalise extends AbstractUserCase {
  async _checks(complemento) {
    /*     const { manifestacoesRepository } = this.repository; */
    /* complemento.manifestacoesComplementares.forEach(async (prefixo) => {
      await manifestacoesRepository.dispensarPendentesPorComplementar(
        complemento.idSolicitacao,
        prefixo,
        complemento.usuario,
        this.trx
      );
    });
    this.retornar_etapa_prefixos = true; */
  }

  async _action(complemento) {
    const { solicitacoesRepository, manifestacoesRepository } = this.repository;
    let novaEtapa = {
      id_status: STATUS.ANALISE,
      id_localizacao: LOCALIZACOES.GESTOR,
      id_etapa: ETAPAS.ANALISE,
    };

    await manifestacoesRepository.deleteDeferimentosPendentes(
      complemento.idSolicitacao
    );
    /*   console.log("RESULTADO", result);

    console.log("COMPLEMENTO:", complemento);
    throw new Error("CAI FORA"); */

    const ordemManifestacaoAtual = await manifestacoesRepository.getOrdemManif(
      complemento.idSolicitacao,
      this.trx
    );

    let novoComplemento = {};
    novoComplemento.id_solicitacao = complemento.idSolicitacao;
    novoComplemento.id_situacao = SITUACOES.PENDENTE;
    novoComplemento.id_acao = ACOES.COMPLEMENTO;
    novoComplemento.matSolicitanteComplemento = complemento.usuario.chave;
    novoComplemento.isComplemento = "1";
    novoComplemento.complementoEsperado = complemento.texto;
    novoComplemento.ordemManifestacao = ordemManifestacaoAtual + 1;
    novoComplemento.nomeFuncao = "ANALISTA";
    novoComplemento.nomePrefixo = "GESTOR";
    novoComplemento.prefixo = "0000";

    await manifestacoesRepository.novaAnalise(novoComplemento, this.trx);

    await solicitacoesRepository.avancarEtapaSolicitacao(
      complemento.idSolicitacao,
      novaEtapa,
      this.trx
    );

    return;
  }
}

module.exports = UcGepesDiteroriaDevolveAnalise;
