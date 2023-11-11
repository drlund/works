"use strict";

const BumblebeeTransformer = use("Bumblebee/Transformer");
const { EncantarConsts } = use("Constants");
const exception = use("App/Exceptions/Handler");
const { CAMINHO_COMMONS } = EncantarConsts;

/** @type {typeof import('../../../Commons/Encantar/Solicitacoes/getSolicitacoesParaRecebimento')} */
const podeCancelarSolicitacao = use(
  `${CAMINHO_COMMONS}/Solicitacoes/podeCancelarSolicitacao`
);

const commonTransform = (solicitacao) => {
  return {
    id: solicitacao.id,
    mci: solicitacao.mci,
    nomeCliente: solicitacao.nomeCliente,
    solicitante: `${solicitacao.matriculaSolicitante} - ${solicitacao.nomeSolicitante}`,
    status: solicitacao.status.descricao,
    ultimaAtualizacao: solicitacao.updatedAt,    
  };
};

/**
 * SolicitacoesTransformer class
 *Brindes
 * @class SolicitacoesTransformer
 * @constructor
 */
class SolicitacoesTransformer extends BumblebeeTransformer {
  static get defaultInclude() {
    return ["brindesSelecionados"];
  }

  includeBrindesSelecionados(solicitacao) {
    return this.collection(
      solicitacao.brindes,
      "Encantar/BrindesTransformer.estoque"
    );
  }

  transform(solicitacao) {
    return {
      ...solicitacao,
      status: {
        ...solicitacao.status,
        finalizada: solicitacao.finalizada === 1 ? true : false,
      },
    };
  }

  async transformAcompanharPendentes(solicitacao) {
    return {
      ...solicitacao,
      solicitante: `${solicitacao.matriculaSolicitante} - ${solicitacao.nomeSolicitante}`,
      status: solicitacao.status.descricao,
      finalizado: solicitacao.status.finaliza === 1 ? true : false,
    };
  }

  transformAprovacaoPendente(solicitacao) {
    const prefixoAprovacaoAtual = solicitacao.fluxoUtilizado.find((fluxo) => {
      return fluxo.sequencia === solicitacao.sequenciaFluxoAtual;
    });
    const common = commonTransform(solicitacao);
    return {
      ...common,
      fluxoAtual: prefixoAprovacaoAtual,
    };
  }

  transformPendentesEntrega(solicitacao) {
    const common = commonTransform(solicitacao);
    return {
      ...common,
    };
  }
  transformPendentesRecebimento(solicitacao) {
    const common = commonTransform(solicitacao);
    return {
      ...common,
      entrega: solicitacao.entrega,
    };
  }

  transformDevolvidas(solicitacao) {
    return {
      id: solicitacao.id,
      mci: solicitacao.mci,
      cliente: solicitacao.nomeCliente,
      solicitante: `${solicitacao.matriculaSolicitante} - ${solicitacao.nomeSolicitante}`,
      status: solicitacao.status.descricao,
      entrega: solicitacao.entrega,
    };
  }
  transformMeuPrefixo(solicitacao) {
    const common = commonTransform(solicitacao);
    return {
      ...common,
    };
  }

  transformFinalizadas(solicitacao) {
    const common = commonTransform(solicitacao);
    return {
      ...common,
    };
  }

  transformAcompanharSolicitacao(solicitacao) {
    const prefixoEntrega = solicitacao.prefixoEntrega
      ? {
          prefixoEntrega: {
            prefixo: solicitacao.prefixoEntrega,
            nome: solicitacao.nomePrefixoEntrega,
          },
        }
      : {};

    return {
      ...solicitacao,
      dadosEntrega: {
        localEntrega: solicitacao.localEntrega,
        complementoEntrega: solicitacao.complementoEntrega,
        ...prefixoEntrega,
      },
    };
  }
}

module.exports = SolicitacoesTransformer;
