"use strict";

const { executeDB2Query } = use("App/Models/DB2/DB2Utils");
const exception = use("App/Exceptions/Handler");
const { getOneFunci, getOneDependencia } = use("App/Commons/Arh");
const { capitalize } = use("App/Commons/StringUtils");

const queryDadosBasicosCliente = `SELECT clientes.COD AS MCI,
       clientes.NOM AS nomeCliente,
       clientes.DTA_NASC_CSNT AS datanascimento,
        clientes.COD_PREF_AGEN
    FROM DB2MCI.CLIENTE clientes
    WHERE clientes.COD = {MCI_CLIENTE}`;

/**
 *
 *  Obtém os dados pessoais de um determinado cliente.
 *  @param {String} mci Mci do cliente que se deseja consultar
 *
 */

async function getDadosPessoaisCliente(mci) {
  try {
    let query = queryDadosBasicosCliente.replace("{MCI_CLIENTE}", mci);
    let dados = await executeDB2Query(query);
    if (dados.length === 0) {
      return null;
    }

    const dadosCliente = dados[0];
    const dadosClientePretty = {
      MCI: dadosCliente.MCI.toString(),
      nomeCliente: capitalize(dadosCliente.NOMECLIENTE.trim()),
      dataNascimento: dadosCliente.DATANASCIMENTO,
    };

    return dadosClientePretty;
  } catch (err) {
    throw new exception(err, 400);
  }
}

module.exports = getDadosPessoaisCliente;
