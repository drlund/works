/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const mtnModel = use("App/Models/Postgres/Mtn");
/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const envolvidoModel = use("App/Models/Postgres/MtnEnvolvido");
/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const vwMtnPendentesSuper = use("App/Models/Postgres/VwMtnPendentesSuper");

/**
 *
 *    Função que atualiza o campo prazo_pendencia_analise de um mtn e o campo dias_desde_ultima_acao do envolvido.
 *    Caso a última ação executada seja mais antiga que atual.
 *    Além disso atualiza a quantidade de dias desde a última ação na tabela de envolvidos, para a instância SUPER.
 *
 *   @param {*} idMtn
 */

async function atualizaPendenciaAnalise(idMtn, trx) {

  const prazoPendencia = await vwMtnPendentesSuper
    .query()
    .where("id_mtn", idMtn)
    .max("prazo");

  const mtn = await mtnModel.find(idMtn);
  mtn.prazo_pendencia_analise = !prazoPendencia
    ? 0
    : parseInt(prazoPendencia[0].max);
  await mtn.save(trx);
}

module.exports = atualizaPendenciaAnalise;
