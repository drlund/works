"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class MtnResposta extends Model {
  static get connection() {
    return "pgMtn";
  }

  static get primaryKey() {
    return "id";
  }

  static get table() {
    return "app_formularios.tb_resposta";
  }

  static get incrementing() {
    return false;
  }

  static get updatedAtColumn() {
    return null;
  }

  static get createdAtColumn() {
    return null;
  }

  static castDates(field, value) {
    return value ? value.format("DD/MM/YYYY hh:mm") : value;
  }

  static get dates() {
    return super.dates.concat(["ts_resposta", "ts_envio"]);
  }

  form() {
    return this.hasOne(
      "App/Models/Postgres/MtnFormulario",
      "id_form",
      "id_form"
    );
  }

  envioEmail() {
    return this.hasOne(
      "App/Models/Postgres/MtnEnvio",
      "id_resposta",
      "id_resposta"
    );
  }

  perguntas() {
    return this.hasMany(
      "App/Models/Postgres/MtnPergunta",
      "id_form",
      "id_form"
    );
  }

  logs() {
    return this.hasMany(
      "App/Models/Postgres/MtnLogAcesso",
      "id_resposta",
      "id_resposta"
    );
  }
}

module.exports = MtnResposta;
