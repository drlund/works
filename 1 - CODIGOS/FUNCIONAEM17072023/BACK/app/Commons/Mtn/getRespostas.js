/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const respostasModel = use("App/Models/Postgres/MtnResposta");

async function getRespostas(matricula, pendentes, admin) {
  const query = respostasModel.query();
  query.distinct("matricula", "id_resposta", "id_form", 'ts_envio', 'id_visao', 'qtd_dias_pendentes');
  
  if (pendentes) {
    query.where("ts_resposta", null).where("resposta", null);
  } else {
    query.where("ts_resposta", "IS NOT", null).where("resposta", "IS NOT", null);
  }
  
  if (!admin) {
    query.where("matricula", matricula);
  }
  query.with("form");
  query.with("envioEmail");
  const DB_respostasPendentes = await query.fetch();
  return DB_respostasPendentes.toJSON();
}

module.exports = getRespostas;