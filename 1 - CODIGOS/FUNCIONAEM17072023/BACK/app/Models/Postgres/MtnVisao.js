"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");
const { mtnConsts } = use("Constants");
const { pgSchema } = mtnConsts;

class MtnVisoes extends Model {
  static get connection() {
    return "pgMtn";
  }

  static get table() {
    return `${pgSchema}.visoes`;
  }

  status() {
    return this.belongsTo(
      "App/Models/Postgres/MtnVisaoStatus",
      "status_id",
      "id"
    );
  }

  versoes() {
    return this.hasMany(
      "App/Models/Postgres/MtnVisoesVersoes",
      "id",
      "visao_id"
    );
  }

  versaoAtual() {
    return this.belongsTo(
      "App/Models/Postgres/MtnVisoesVersoes",
      "versao_atual_id",
      "id"
    );
  }

  linhaTempo() {
    return this.hasMany(
      "App/Models/Postgres/MtnVisoesLinhaTempo",
      "id",
      "visao_id"
    );
  }

  mtns() {
    return this.hasMany("App/Models/Postgres/Mtn", "id", "id_visao");
  }

  //formato de saida das datas
  static castDates(field, value) {
    return value.format("DD/MM/YYYY hh:mm");
  }
}

module.exports = MtnVisoes;
