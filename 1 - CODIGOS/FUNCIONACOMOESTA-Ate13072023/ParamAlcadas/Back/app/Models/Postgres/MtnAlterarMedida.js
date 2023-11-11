"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");
const { mtnConsts } = use("Constants");
const { pgSchema } = mtnConsts;

class MtnAlteracaoMedida extends Model {
  static get connection() {
    return "pgMtn";
  }

  static get table() {
    return `${pgSchema}.alteracao_medida`;
  }

  static get dates() {
    return super.dates.concat(["dt_criacao_solicitacao", "dt_confirmacao_solicitacao"]);
  }

  static castDates(field, value) {
    return value.format("DD/MM/YYYY HH:mm");
  }

  medidaAntiga() {
    return this.belongsTo(
      "App/Models/Postgres/MtnMedida",
      "id_medida_antiga",
      "id"
    );
  }
  medidaNova() {
    return this.belongsTo(
      "App/Models/Postgres/MtnMedida",
      "id_medida_nova",
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

  anexos() {
    return this.hasMany(
      "App/Models/Postgres/MtnAlterarMedidaAnexo",
      "id",
      "id_alteracao_medida"
    );
  }
}

module.exports = MtnAlteracaoMedida;
