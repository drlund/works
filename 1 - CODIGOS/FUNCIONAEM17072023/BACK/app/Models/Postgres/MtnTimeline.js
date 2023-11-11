"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");
const { mtnConsts } = use("Constants");
const { pgSchema } = mtnConsts;
/** @type {typeof import('moment')} */
const moment = require("moment");

class MtnTimeline extends Model {
  static get connection() {
    return "pgMtn";
  }

  static castDates(field, value) {
    return value.format("DD/MM/YYYY HH:mm");
  }

  static get table() {
    return `${pgSchema}.timeline`;
  }

  getCreatedAt(created_at) {
    return moment(created_at).format("DD/MM/YYYY HH:mm");
  }

  static get createdAtColumn() {
    return "created_at";
  }

  acao() {
    return this.hasOne("App/Models/Postgres/MtnTiposAcao", "id_acao", "id");
  }

  envolvido() {
    return this.hasOne(
      "App/Models/Postgres/MtnEnvolvido",
      "id_envolvido",
      "id"
    );
  }
}

module.exports = MtnTimeline;
