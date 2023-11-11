/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const esclarecimentoModel = use("App/Models/Postgres/MtnEsclarecimento");
const typeDefs = require("../../Types/TypeUsuarioLogado");
/** @type {typeof import('moment')} */
const moment = require("moment");

/**
 * @param {Object} esclarecimento
 * @param {import('../../Types/TypeUsuarioLogado').UsuarioLogado} dadosUsuario
 * @param {Object} trx
 */

async function registrarLeituraEsclarecimento(
  dadosEsclarecimento,
  dadosUsuario,
  trx
) {
  if (dadosEsclarecimento.lido === true) {
    return;
  }
  const esclarecimento = await esclarecimentoModel.find(dadosEsclarecimento.id);
  esclarecimento.lido = true;
  esclarecimento.lido_em = moment().format("YYYY-MM-DD HH:mm");
  await esclarecimento.save(trx);
}

module.exports = registrarLeituraEsclarecimento;
