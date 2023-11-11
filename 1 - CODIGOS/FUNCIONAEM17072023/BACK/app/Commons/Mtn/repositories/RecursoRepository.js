"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const recursoModel = use("App/Models/Postgres/MtnRecurso");

class RecursoRepository {
  async getRecursoByEnvolvido(idEnvolvido) {
    const recurso = await recursoModel
      .query()
      .where("id_envolvido", idEnvolvido)
      .whereNull("respondido_em")
      .whereNull("revelia_em")
      .orderBy("created_at", "desc")
      .first();
    return recurso;
  }

  async create(
    {
      idEnvolvido,
      txtParecer,
      idMedida,
      matRespAnalise,
      nomeRespAnalise,
      prefixoRespAnalise,
      nomePrefixoRespAnalise,
    },
    trx
  ) {
    const recurso = new recursoModel();
    recurso.id_envolvido = idEnvolvido;
    recurso.txt_parecer = txtParecer;
    recurso.id_medida = idMedida;
    recurso.mat_resp_analise = matRespAnalise;
    recurso.nome_resp_analise = nomeRespAnalise;
    recurso.cd_prefixo_resp_analise = prefixoRespAnalise;
    recurso.nome_prefixo_resp_analise = nomePrefixoRespAnalise;
    await recurso.save(trx);
    return recurso.toJSON();
  }
}

module.exports = RecursoRepository;
