"use strict";

const { EncantarConsts } = use("Constants");
const { STATUS_SOLICITACAO, CAMINHO_MODELS } = EncantarConsts;
const exception = use("App/Exceptions/Handler");
/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const solicitacoesModel = use(`${CAMINHO_MODELS}/Solicitacoes`);

const queryStrategy = {
  mci: (query, mci) => {
    query.where((builder) => {
      builder.where("mci", mci);
    });
  },
  periodoCriacaoSolicitacao: (query, periodoCriacaoSolicitacao) => {
    query.where((builder) => {
      builder.where(
        "createdAt",
        ">=",
        periodoCriacaoSolicitacao[0].format("YYYY-MM-DD")
      );
      builder.where(
        "createdAt",
        "<=",
        periodoCriacaoSolicitacao[1].format("YYYY-MM-DD")
      );
    });
  },
  solicitante: (query, matriculaSolicitante) => {
    query.where((builder) => {
      builder.where("matriculaSolicitante", matriculaSolicitante);
    });
  },
};

const validarFiltrosRecebidos = (filtros) => {
  const filtrosAceitos = Object.keys(queryStrategy);
  for (const filtro of Object.keys(filtros)) {
    if (!filtrosAceitos.includes(filtro)) {
      throw new exception(
        `Função getSolicitacoesFinalizadas: Filtro "${filtro}" não implementado. Somentes são aceitos ${JSON.stringify(
          filtrosAceitos
        )}`,
        500
      );
    }
  }
};

/**
 *
 *  Retorna as solicitações disponíveis para registro de reacao
 *
 */

const getSolicitacoesParaReacao = async (filtros) => {
  validarFiltrosRecebidos(filtros);
  const query = solicitacoesModel
    .query()
    .select("id", "mci", "nomeCliente", "matriculaSolicitante", "nomeSolicitante", "createdAt", "idSolicitacoesStatus")
    .with("status")
    .where("idSolicitacoesStatus", STATUS_SOLICITACAO.ENTREGUE);
  for (const filtro of Object.keys(filtros)) {
    queryStrategy[filtro](query, filtros[filtro]);
  }
  const solicitacoes = await query.fetch();
  return solicitacoes;
};

module.exports = getSolicitacoesParaReacao;
