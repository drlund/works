/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const mtnModel = use("App/Models/Postgres/Mtn");

/**
 *
 * @param {string} matricula Matrícula do envolvido
 * @param {number[]} mtnsIgnorados Array de ids que devem ser desconsiderados no histórico
 */
async function getHistoricoMtn(matricula, mtnsIgnorados) {
  const query = mtnModel.query();
  if (Array.isArray(mtnsIgnorados) && mtnsIgnorados.length > 0) {
    query.whereNotIn("id", mtnsIgnorados);
  }
  let mtnsHistorico = await query
    .whereHas("envolvidos", (builder) => {
      builder.where("matricula", matricula);
    })
    .with("visao")
    .with("envolvidos", (builder) => {
      builder.where("matricula", matricula);
      builder.with("medida");
    })
    .with("status")
    .fetch();

  return mtnsHistorico.toJSON();
}

module.exports = getHistoricoMtn;
