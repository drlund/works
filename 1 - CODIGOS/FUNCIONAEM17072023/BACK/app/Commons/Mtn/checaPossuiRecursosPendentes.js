/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const recursoModel = use("App/Models/Postgres/MtnRecurso");

/**
 * 
 *  Verifica se existe algum recurso pendente para o o envolvido
 *  @param {number} idEnvolvido 
 * 
 */

const checaPossuiRecursosPendentes = async (idEnvolvido) => {
  const recursosPendentes = await recursoModel
    .query()
    .where("id_envolvido", idEnvolvido)
    .whereNull("respondido_em")
    .whereNull("revelia_em")
    .fetch();

  return recursosPendentes.toJSON().length > 0;
};

module.exports = checaPossuiRecursosPendentes;
