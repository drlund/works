"use strict";
const OcorrenciaTarifaRepository = use(
  "App/Commons/Tarifas/repositories/OcorrenciaTarifaRepository"
);

/**
 * @typedef {Object} FiltrosPublicoAlvo
 * @property {string} mci
 * @property {string} cpf_cnpj
 * @property {string} nomeCliente
 */

const validarFiltros = (filtros) => {
  const { mci, nomeCliente, cpf_cnpj } = filtros;
  if (!mci && !nomeCliente && !cpf_cnpj) {
    throw { message: "Ao menos um filtro deve ser informado", status: 400 };
  }  
};

/**
 *
 *  Baseado nos filros recebidos, retorna as ocorrências pendentes de pagamento
 *
 * @param {FiltrosPublicoAlvo} filtros
 * @returns
 *
 */
const getPublicoAlvo = async (filtros) => {
  validarFiltros(filtros);
  const ocorrenciaTarifaRepository = new OcorrenciaTarifaRepository();
  const ocorrenciasPendentes =
    await ocorrenciaTarifaRepository.getOcorrenciasPendentes(filtros);
  const ocorrenciasEmAndamento =
    await ocorrenciaTarifaRepository.getOcorrenciasEmAndamento(filtros);
  return {
    pendentes: ocorrenciasPendentes,
    emAndamento: ocorrenciasEmAndamento,
  };
};

module.exports = getPublicoAlvo;
