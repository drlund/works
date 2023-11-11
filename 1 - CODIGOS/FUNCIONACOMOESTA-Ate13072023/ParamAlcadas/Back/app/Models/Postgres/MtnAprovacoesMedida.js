"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");
const { mtnConsts } = use("Constants");
const { pgSchema } = mtnConsts;

class MtnAprovacoesMedida extends Model {
  static get connection() {
    return "pgMtn";
  }

  static get table() {
    return `${pgSchema}.aprovacoes_medida`;
  }

  static get dates() {
    return super.dates.concat(["analise_em"]);
  }

  static castDates(field, value) {
    return value.format("DD/MM/YYYY HH:mm");
  }

  medidaProposta() {
    return this.belongsTo(
      "App/Models/Postgres/MtnMedida",
      "id_medida_proposta",
      "id"
    );
  }

  medidaAprovada() {
    return this.belongsTo(
      "App/Models/Postgres/MtnMedida",
      "id_medida_aprovada",
      "id"
    );
  }

  envolvido() {
    return this.belongsTo(
      "App/Models/Postgres/MtnEnvolvido",
      "id_envolvido",
      "id"
    );
  }

}

module.exports = MtnAprovacoesMedida;
