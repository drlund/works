/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const prazosModel = use("App/Models/Postgres/MtnConfigPrazos");
const moment = require("moment");

/**
 * 
 *   Verifica se as ações decorrentes de prazos vencidos serão executadas ou não.
 *   Caso negativo, os prazos continuam a ser calculados mas o vencimento não causa nenhum efeito no sistema.
 * 
 */

const isAcoesNoVecimento = async () => {
  const configPrazos = await prazosModel.last();
  const { acoes_no_vencimento } = configPrazos.config;
  return acoes_no_vencimento ? acoes_no_vencimento : false;

};

module.exports = isAcoesNoVecimento;
