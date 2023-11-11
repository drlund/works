"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");
const { mtnConsts } = use("Constants");
const { pgSchema } = mtnConsts;
/** @type {typeof import('moment')} */
const moment = use("moment");
class MtnEsclarecimento extends Model {
  static get connection() {
    return "pgMtn";
  }

  static castDates(field, value) {
    return value.format("DD/MM/YYYY HH:mm");
  }
  static get table() {
    return `${pgSchema}.esclarecimentos`;
  }

  getCreatedAt(created_at) {
    return moment(created_at).format("DD/MM/YYYY HH:mm");
  }
  
  static get dates() {
    return super.dates.concat(["respondido_em","revelia_em"]);
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
      "App/Models/Postgres/MtnEsclarecimentoAnexo",
      "id",
      "id_esclarecimento"
    );
  }
}

module.exports = MtnEsclarecimento;
