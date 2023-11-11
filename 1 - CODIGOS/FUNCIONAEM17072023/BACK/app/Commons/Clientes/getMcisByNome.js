"use strict";

const getDadosClienteByNome = use("App/Commons/Clientes/getDadosClienteByNome");

/**
 *  Função que pesquisa clientes pelo seu nome, retornando array de MCIS dos mesmo
 *
 * @param {String} nomeCliente
 * @returns
 */
const getMcisPorNome = async (nomeCliente, mcis) => {
  const clientes = await getDadosClienteByNome(nomeCliente,mcis);
  return clientes.map((cliente) => cliente.MCI);
};

module.exports = getMcisPorNome;
