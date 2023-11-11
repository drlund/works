const { ModelNotFoundException } = require('@adonisjs/lucid/src/Exceptions');

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const esclarecimentoModel = use("App/Models/Postgres/MtnEsclarecimento");

const checaPossuiEsclarecimentosPendentes = async (idEnvolvido) => {
  
  const esclarecimentosPendentes = await esclarecimentoModel
    .query()
    .where("id_envolvido", idEnvolvido)
    .whereNull("respondido_em")
    .whereNull("revelia_em")
    .fetch();

  return esclarecimentosPendentes.toJSON().length > 0;

};

module.exports = checaPossuiEsclarecimentosPendentes;