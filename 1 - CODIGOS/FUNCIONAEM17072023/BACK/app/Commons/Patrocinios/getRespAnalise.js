const RespAnalise = use("App/Models/Mysql/Patrocinios/RespAnalise");

/**
 * Metodo utilitário que retorna array de responsável pela análise da solicitação
 * @param {Integer} idSolicitacao 
 */
async function getRespAnalise(idSolicitacao) {
  if (idSolicitacao) {
    const respAnalise = await RespAnalise.query().where({ idSolicitacao, ativo: 1 }).fetch();

    if (respAnalise.rows) {
      return respAnalise.rows;
    }
  }

  return [];
}

module.exports = getRespAnalise;