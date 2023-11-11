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

class UCDispensarDespacho extends AbstractUserCase {
  async _checks() {}

  async _action(despacho) {
    const { solicitacoesRepository, manifestacoesRepository } = this.repository;
    let novaEtapa;

    const ordemManifestacaoAtual = await manifestacoesRepository.getOrdemManif(
      despacho.idSolicitacao,
      this.trx
    );
    const temOperador =
      await manifestacoesRepository.algumTipoSolicitacaoTemOperador(
        despacho.idSolicitacao,
        this.trx
      );

    const diretoriasEnvolvidas =
      await solicitacoesRepository.getDiretoriasEnvolvidas(
        despacho.idSolicitacao,
        this.trx
      );

    const qtdDiretoriasEnvolvidas =
      diretoriasEnvolvidas[0]?.diretoriaOrigem ==
      diretoriasEnvolvidas[0]?.diretoriaDestino
        ? 1
        : 2;

    console.log(despacho);
    const newDespachante = {
      id_solicitacao: despacho.idSolicitacao,
      nome: despacho.usuario.nome_usuario,
      matricula: despacho.usuario.matricula,
      funcao: despacho.usuario.cod_funcao,
      nomeFuncao: despacho.usuario.nome_funcao,
      prefixo: despacho.diretoria[0],
      nomePrefixo: despacho.diretoria[1],
      id_situacao: SITUACOES.DISPENSADA,
      id_acao: ACOES.DEFERIMENTO,
      ordemManifestacao: ordemManifestacaoAtual + 1,
      parecer: PARECER_STRING.FAVORAVEL,
      texto: "Dispensado pelo despachante.",
      id_escalao: 5,
    };

    const newSavedByTransactionManifestation =
      await manifestacoesRepository.dispensaManifestacaoDeferidor(
        newDespachante,
        this.trx
      );

    if (qtdDiretoriasEnvolvidas == 1 && newSavedByTransactionManifestation.id) {
      //checar se criterio/

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

      return await solicitacoesRepository.avancarEtapaSolicitacao(
        despacho.idSolicitacao,
        novaEtapa,
        this.trx
      );
    }

    if (qtdDiretoriasEnvolvidas == 2) {
      const dadosSolicitacao = await solicitacoesRepository.umaSolicitacaoPorId(
        despacho.idSolicitacao,
        this.trx
      );

      const existeDeferimentoDestino =
        diretoriasEnvolvidas[0].diretoriaDestino ==
          newSavedByTransactionManifestation.prefixo ||
        dadosSolicitacao.manifestacoes.find(
          (manifestacao) =>
            manifestacao.id_acao == ACOES.DEFERIMENTO &&
            manifestacao.prefixo == diretoriasEnvolvidas[0].diretoriaDestino
        );

      const existeDeferimentoOrigem =
        diretoriasEnvolvidas[0].diretoriaOrigem ==
          newSavedByTransactionManifestation.prefixo ||
        dadosSolicitacao.manifestacoes.find(
          (manifestacao) =>
            manifestacao.id_acao == ACOES.DEFERIMENTO &&
            manifestacao.prefixo == diretoriasEnvolvidas[0].diretoriaOrigem
        );

      if (existeDeferimentoDestino && existeDeferimentoOrigem) {
        //Se tem pendente \/
        const temPendente =
          await manifestacoesRepository.temDeferimentoPendente(
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
  }
}

module.exports = UCDispensarDespacho;
