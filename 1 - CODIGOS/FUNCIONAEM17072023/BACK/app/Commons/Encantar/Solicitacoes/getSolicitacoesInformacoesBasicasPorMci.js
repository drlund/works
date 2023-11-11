const { query } = require("@adonisjs/lucid/src/Lucid/Model");

//CONSTANTES
const { EncantarConsts } = use("Constants");
const { CAMINHO_MODELS } = EncantarConsts;
const exception = use("App/Exceptions/Handler");
/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const solicitacoesModel = use(`${CAMINHO_MODELS}/Solicitacoes`);

/**
 *
 *  Retorna as solicitações registradas para um determinado MCI.
 *
 *  Filtros permitidos: excluirStatus
 *
 *  @param {string} mci
 *  @param {Object} filtros Objeto com os filtros para as solicitacoes do cliente. Filtros implementados:
 *  @returns {Boolean}
 *
 */

const filtrar = {
  desconsiderarStatus: (query, arrayStatusDesconsiderar) => {
    query.where((builder) => {
      builder.whereNotIn("idSolicitacoesStatus", arrayStatusDesconsiderar);
    });
  },
  desconsiderarIds: (query, arrayIdsDesconsiderar) => {
    query.where((builder) => {
      builder.whereNotIn("id", arrayIdsDesconsiderar);
    });
  },
};

const getSolicitacoesInformacoesBasicasPorMci = async (mci, filtros) => {
  const querySolicitacoes = solicitacoesModel.query();
  querySolicitacoes.where("mci", mci);
  querySolicitacoes.select("id", "dataSolicitacao", "mci", "nomeCliente");

  for (const filtro in filtros) {
    if (!filtros[filtro]) {
      throw new exception(
        `Função getSolicitacoesInformacoesBasicasPorMci:  Filtro ${filtro} inválido para essa função`,
        500
      );
    }

    filtrar[filtro](querySolicitacoes, filtros[filtro]);
  }

  const solicitacoes = await querySolicitacoes.fetch();
  return solicitacoes.toJSON();
};

module.exports = getSolicitacoesInformacoesBasicasPorMci;
