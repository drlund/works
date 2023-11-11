const { executeDB2Query } = use("App/Models/DB2/DB2Utils");
const exception = use("App/Exceptions/Handler");
const { replaceVariable } = use("App/Commons/StringUtils");

const queryClassificacaoCliente = `SELECT DISTINCT t1.CD_CLI_APRC AS MCI, t1.CD_TIP_CLSC_QDR AS CLASSIFICACAO
FROM DB2REL.FATO_APRC_RSTD_CLI t1
INNER JOIN (
      SELECT t3.CD_CLI_APRC, (MAX(t3.DT_RSTD_APRC)) AS ULT_DT_RSTD_APRC
   FROM DB2REL.FATO_APRC_RSTD_CLI t3
   WHERE t3.CD_CLI_APRC = {1}
   GROUP BY t3.CD_CLI_APRC
) t2 ON t2.CD_CLI_APRC = t1.CD_CLI_APRC AND t2.ULT_DT_RSTD_APRC = t1.DT_RSTD_APRC
WHERE t1.CD_CLI_APRC = {1}`;

/**
 *
 *  Obtém classificação de um determinado cliente. A avaliação utilizada aqui é o 'Código do Tipo de Classificação da Avaliação do Cliente'.
 *
 *  RETIRADO DO AD (22/08/2020):
 *    Tem como objetivo, registrar o resultado da apuração final do Cliente,
 *    baseado em parâmetros e regras sob a responsabilidade e coordenação da DIREC.
 *    A apuração é realizada mensalmente para avaliar as performances dos clientes.
 *
 *  @param {String} mci Mci do cliente que se deseja consultar
 *
 */
async function getClassificacaoCliente(
  mci,
  classificacaoTransform = (classificacao) => classificacao
) {
  try {
    prefixo = parseInt(mci);

    let query = replaceVariable(queryClassificacaoCliente, [mci]);
    let dados = await executeDB2Query(query);

    if (dados.length === 0) {
      return null;
    }

    const dadosClassificacao = dados[0];

    const dadosClassificacaoTransformados = {
      MCI: dadosClassificacao.MCI.toString(),
      classificacao: dadosClassificacao.CLASSIFICACAO,
    };

    return classificacaoTransform(
      dadosClassificacaoTransformados.classificacao
    );
  } catch (err) {
    throw new exception(err, 400);
  }
}

module.exports = getClassificacaoCliente;
