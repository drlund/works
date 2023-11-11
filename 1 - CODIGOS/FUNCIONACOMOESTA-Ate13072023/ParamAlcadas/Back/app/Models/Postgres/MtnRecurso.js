"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");
/** @type {typeof import('moment')} */
const moment = require("moment");

const { mtnConsts } = use("Constants");
const { pgSchema } = mtnConsts;
class MtnRecurso extends Model {
  static get connection() {
    return "pgMtn";
  }

  static get table() {
    return `${pgSchema}.recursos`;
  }

  static get dates() {
    return super.dates.concat(["respondido_em", "revelia_em", "lido_em"]);
  }

  getCreatedAt(created_at) {
    return moment(created_at).format("DD/MM/YYYY HH:mm");
  }

  static castDates(field, value) {
    return value.format("DD/MM/YYYY HH:mm");
  }

  envolvido() {
    return this.belongsTo(
      "App/Models/Postgres/MtnEnvolvido",
      "id_envolvido",
      "id"
    );
  }

  medida() {
    return this.belongsTo("App/Models/Postgres/MtnMedida", "id_medida", "id");
  }

  anexosParecer() {
    return this.hasMany(
      "App/Models/Postgres/MtnParecerRecursoAnexo",
      "id",
      "id_recurso"
    );
  }

  anexos() {
    return this.hasMany(
      "App/Models/Postgres/MtnRecursosAnexo",
      "id",
      "id_recurso"
    );
  }
}

module.exports = MtnRecurso;
