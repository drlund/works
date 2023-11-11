/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const recursoModel = use("App/Models/Postgres/MtnRecurso");
const typeDefs = require("../../Types/TypeUsuarioLogado");
/** @type {typeof import('moment')} */
const moment = require("moment");

/**
 * @param {Object} recurso
 * @param {import('../../Types/TypeUsuarioLogado').UsuarioLogado} dadosUsuario
 * @param {Object} trx
 */

async function registrarLeituraRecurso(dadosRecurso, dadosUsuario, trx) {
  if (dadosRecurso.lido === true) {
    return;
  }

  const recurso = await recursoModel.find(dadosRecurso.id);
  recurso.lido = true;
  recurso.lido_em = moment().format("YYYY-MM-DD HH:mm");
  await recurso.save(trx);
}

module.exports = registrarLeituraRecurso;
