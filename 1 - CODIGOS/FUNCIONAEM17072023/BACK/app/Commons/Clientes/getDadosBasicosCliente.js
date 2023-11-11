const { executeDB2Query } = use("App/Models/DB2/DB2Utils");
const exception = use("App/Exceptions/Handler");
const { getOneFunci, getOneDependencia } = use("App/Commons/Arh");
const { capitalize } = use("App/Commons/StringUtils");

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
WHERE clientes.COD = {MCI_CLIENTE}`;

/**
 *
 *  Obtém os dados básicos, pessoais e de encarteiramento, de um determinado cliente.
 *  @param {String} mci Mci do cliente que se deseja consultar
 *  @param {Boolean} dadosGerente Indicar se deseja que seja retornado dados referentes ao gerente do funcionário
 *
 */
async function getDadosBasicosCliente(mci, dadosGerente = false) {
  try {
    prefixo = parseInt(mci);

    let query = queryDadosBasicosCliente.replace("{MCI_CLIENTE}", mci);
    let dados = await executeDB2Query(query);

    if (dados.length === 0) {
      return null;
    }

    const dadosCliente = dados[0];

    const dadosPrefixo = await getOneDependencia(
      dadosCliente.PREFIXOENCARTEIRADO
        ? dadosCliente.PREFIXOENCARTEIRADO
        : dadosCliente.COD_PREF_AGEN
    );

    const dadosClientePretty = {
      MCI: dadosCliente.MCI.toString(),
      nomeCliente: capitalize(dadosCliente.NOMECLIENTE.trim()),
      dataNascimento: dadosCliente.DATANASCIMENTO,
      prefixoEncarteirado: dadosCliente.PREFIXOENCARTEIRADO
        ? dadosCliente.PREFIXOENCARTEIRADO
        : dadosPrefixo.prefixo,
      nomePrefixo: dadosPrefixo ? dadosPrefixo.nome : "Não encarteirado",
      nrCarteira: dadosCliente.NRCARTEIRA
        ? dadosCliente.NRCARTEIRA
        : "Não encarteirado",
      codTipoCarteira: dadosCliente.CODTIPOCARTEIRA
        ? dadosCliente.CODTIPOCARTEIRA
        : "Não encarteirado",
      nomeCarteira: dadosCliente.NM_TIP_CTRA
        ? capitalize(dadosCliente.NM_TIP_CTRA.trim())
        : "Não encarteirado",
    };

    if (dadosGerente) {
      
      const matriculaGerente =
        typeof dadosCliente.MATRICULAGERENTE === "string"
          ? dadosCliente.MATRICULAGERENTE
          : dadosCliente.MATRICULAGERENTE.toString();

      const dadosFunci = dadosCliente.PREFIXOENCARTEIRADO
        ? await getOneFunci("F" + matriculaGerente.padStart(7, "0"))
        : null;

      (dadosClientePretty.matriculaGerente =
        dadosFunci !== null ? dadosFunci.matricula : "Não disponível"),
        (dadosClientePretty.nomeGerente =
          dadosFunci !== null ? capitalize(dadosFunci.nome) : "Não disponível");
    }

    return dadosClientePretty;
  } catch (err) {
    throw new exception(err, 400);
  }
}

module.exports = getDadosBasicosCliente;
