"use strict";

const ausenciaModel = use("App/Models/Mysql/Ausencia");
const comissaoModel = use("App/Models/Mysql/Arh/ComissoesFot06");

const Database = use("Database");
class FuncionarioRepository {
  async getAusencias(matricula, dataInicio, dataFim) {
    const ausencias = await ausenciaModel
      .query()
      .select("*", Database.raw("DATEDIFF(dt_final,dt_inicio) + 1 AS qtd_dias"))
      .where("matricula", matricula)
      .where((builder) => {
        builder
          .where((builder) => {
            builder.where("dt_inicio", ">=", dataInicio);
            builder.where("dt_final", "<=", dataFim);
          })
          .orWhere((builder) => {
            builder.where("dt_inicio", ">=", dataInicio);
            builder.where("dt_final", ">=", dataFim);
          });
      })
      .fetch();
    return ausencias.toJSON();
  }  
}

module.exports = FuncionarioRepository;
