/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const mtnLogsAcesso = use("App/Models/Postgres/MtnLogAcesso");

async function getVisualizado(resposta) {
  const DB_logAcesso = await mtnLogsAcesso
    .query()
    .select("*")
    .distinct("matricula")
    .where("matricula", resposta.matricula)
    .where("id_resposta", resposta.id_resposta)
    .orderBy("ts_acesso", "desc")
    .fetch();
  return DB_logAcesso.toJSON().length > 0;
}

module.exports = getVisualizado;