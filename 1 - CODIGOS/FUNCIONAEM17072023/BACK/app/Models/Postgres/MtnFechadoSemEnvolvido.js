"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

const { mtnConsts } = use("Constants");
const { pgSchema } = mtnConsts;
/** @type {typeof import('moment')} */
const moment = require("moment");
class MtnFechadoSemEnvolvido extends Model {
  static get connection() {
    return "pgMtn";
  }

  static get table() {
    return `${pgSchema}.mtns_fechados_sem_envolvidos`;
  }

  static castDates(field, value) {
    return value.format("DD/MM/YYYY HH:mm");
  }

  getCreatedAt(created_at) {
    return moment(created_at).format("DD/MM/YYYY HH:mm");
  }

  mtn() {
    return this.belongsTo("App/Models/Postgres/Mtn", "id_mtn", "id");
  }

  anexos() {
    return this.hasMany(
      "App/Models/Postgres/MtnFechadosSemEnvolvidosAnexos",
      "id",
      "id_mtn_fechado_sem_envolvido"
    );
  }
}

module.exports = MtnFechadoSemEnvolvido;
