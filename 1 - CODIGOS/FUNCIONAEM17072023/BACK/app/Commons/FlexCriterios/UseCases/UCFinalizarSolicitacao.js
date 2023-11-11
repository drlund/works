"use strict";
const {
  AbstractUserCase,
  ExpectedAbstractError,
} = require("../../AbstractUserCase");
const { STATUS, ETAPAS } = require("../Constants");
const Manifestacao = require("../Entidades/Manifestacao");

class UcFinalizarSolicitacao extends AbstractUserCase {
  async _checks(analise) {
    const podeFinalizarSolicitações = await this.functions.hasPermission({
      nomeFerramenta: "Flex Critérios",
      dadosUsuario: analise.usuario,
      permissoesRequeridas: ["EXECUTANTE", "ROOT"],
    });
    /*     if (!podeFinalizarSolicitações) {
      throw new Error(
        "Você não tem permissão para finalizar esta solicitação de flexibilização."
      );
    } */
  }

  async _action(analise) {
    const { solicitacoesRepository, manifestacoesRepository } = this.repository;

    const diretoriasEnvolvidas =
      await solicitacoesRepository.getDiretoriasEnvolvidas(
        analise.idSolicitacao,
        this.trx
      );

    if (!diretoriasEnvolvidas) {
      throw new ExpectedAbstractError(
        "Erro ao consultar solicitação envolvida!",
        403
      );
    }

    const qtdDiretoriasEnvolvidas =
      diretoriasEnvolvidas[0]?.diretoriaOrigem ==
      diretoriasEnvolvidas[0]?.diretoriaDestino
        ? 1
        : 2;

    const listaDiretoriasPraQueryWhereIn =
      qtdDiretoriasEnvolvidas == 1
        ? [diretoriasEnvolvidas[0].diretoriaOrigem]
        : [
            diretoriasEnvolvidas[0].diretoriaOrigem,
            diretoriasEnvolvidas[0].diretoriaDestino,
          ];

    const manifestacoesDeferimento =
      await manifestacoesRepository.getManifestacoesDeferimento(
        analise.idSolicitacao,
        listaDiretoriasPraQueryWhereIn,
        this.trx
      );

    if (!manifestacoesDeferimento) {
      throw new ExpectedAbstractError(
        "Não foram encontrados registros de manifestações de deferimento para esta solicitação!",
        403
      );
    }

    //A unica validação que não foi feita é a de: comparar se nos manifestacoesDeferimento.prefixos
    //tem das diretorias, caso grave dois slots pro mesmo
    if (qtdDiretoriasEnvolvidas != manifestacoesDeferimento.length) {
      throw new ExpectedAbstractError(
        "Pedido não pode ser finalizado, faltam manifestações de deferimento!",
        403
      );
    }

    const ordemManifestacaoAtual = await manifestacoesRepository.getOrdemManif(
      analise.idSolicitacao,
      this.trx
    );

    const dadosAnalise = Manifestacao.transformNovaFinalizacao(analise);
    dadosAnalise.ordemManifestacao = ordemManifestacaoAtual + 1;
    await manifestacoesRepository.novaAnalise(dadosAnalise, this.trx);

    const novaEtapa = {
      id_status: STATUS.ENCERRADO,
      id_etapa: ETAPAS.ENCERRADO,
    };

    await solicitacoesRepository.avancarEtapaSolicitacao(
      dadosAnalise.id_solicitacao,
      novaEtapa,
      this.trx
    );

    return dadosAnalise.id_solicitacao;
  }
}

module.exports = UcFinalizarSolicitacao;
