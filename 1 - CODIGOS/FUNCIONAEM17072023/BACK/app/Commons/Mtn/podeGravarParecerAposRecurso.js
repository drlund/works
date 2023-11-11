/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const recursoModel = use("App/Models/Postgres/MtnRecurso");

/**
 *
 *  Quando o envolvido já respondeu um recurso, o novo parecer deve ser registrado por um usuário diferente daquele que registrou o parecer original.
 *  Essa função indica se está ocorrendo a dupla confirmação, ou seja, se o funcionário é diferente daquele que registrou o parecer original.
 *
 *
 *  @param {number} idEnvolvido
 *  @param {string} matriculaUsuarioLogado
 *
 *  @return {Boolean} Indica seo usuário é diferente do parecer original. Caso o recurso não tenha sido encontrado, retorna true;
 *
 */

const podeGravarParecerAposRecurso = async (
  idEnvolvido,
  matriculaUsuarioLogado
) => {

  const recurso = await recursoModel
    .query()
    .where("id_envolvido", idEnvolvido)
    .whereNull("respondido_em")
    .whereNull("revelia_em")
    .orderBy("created_at", "desc")
    .first();

  if (!recurso) {
    return true;
  }

  return recurso.mat_resp_analise === matriculaUsuarioLogado;
};

module.exports = podeGravarParecerAposRecurso;
