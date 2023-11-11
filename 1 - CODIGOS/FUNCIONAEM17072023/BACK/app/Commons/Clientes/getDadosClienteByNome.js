const { executeDB2Query } = use("App/Models/DB2/DB2Utils");
const exception = use("App/Exceptions/Handler");

const queryDadosBasicosCliente = `SELECT clientes.COD AS MCI,
       clientes.NOM AS nomeCliente,
       clientes.DTA_NASC_CSNT AS datanascimento,
  encarteirados.CD_PRF_DEPE AS prefixoEncarteirado,
  encarteirados.NR_SEQL_CTRA AS nrCarteira,
  carteiras.CD_TIP_CTRA AS codTipoCarteira,
  clientes.COD_PREF_AGEN,
  tipoCarteira.NM_tip_CTRA, carteiras.NR_MTC_ADM_CTRA as matriculaGerente
FROM DB2MCI.CLIENTE clientes
LEFT JOIN DB2REL.CLI_CTRA AS encarteirados ON  ENCARTEIRADOS.CD_CLI = clientes.COD
LEFT JOIN DB2REL.CTRA_CLI AS carteiras ON CARTEIRAS.CD_PRF_DEPE = encarteirados.CD_PRF_DEPE AND carteiras.NR_SEQL_CTRA = encarteirados.nr_seql_ctra
LEFT JOIN db2rel.TIP_CTRA AS tipoCarteira ON CARTEIRAS.CD_TIP_CTRA = TIPOCARTEIRA.CD_TIP_CTRA
WHERE `;

/**
 *
 *  Obtém os dados básicos de um determinado cliente, pelo nome.
 *
 *  @param {String} nomeCliente Nome do cliente a ser pesquisado
 *  @param {Number[]} codigosMCI Por um questão de performance, às vezes é necessário limitar os MCIS a serem pesquisados. Caso este parâmetro não seja passado, todos os clientes serão considerados
 *
 */

async function getDadosClienteByNome(nomeCliente, codigosMCI = []) {
  try {
    let query = queryDadosBasicosCliente;
    if (codigosMCI.length > 0) {
      query += `clientes.COD IN ({ARRAY_MCIS}) AND `;
    }

    query += `clientes.NOM LIKE '%{NOME_CLIENTE}%'`;
    query
      .replace("{NOME_CLIENTE}", nomeCliente)
      .replace("{ARRAY_MCIS}", codigosMCI.join(", "));
    let dados = await executeDB2Query(query);
    if (dados.length === 0) {
      return [];
    }
    return dados;
  } catch (err) {
    throw new exception(err, 400);
  }
}

module.exports = getDadosClienteByNome;
