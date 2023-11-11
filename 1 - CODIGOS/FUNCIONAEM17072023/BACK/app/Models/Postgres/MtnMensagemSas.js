"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

const { mtnConsts } = use("Constants");
const { pgSchema } = mtnConsts;

class MtnMensagemSas extends Model {
  static get connection() {
    return "pgMtn";
  }

  static get table() {
    return `${pgSchema}.mensagem_email`;
  }

  static castDates(field, value) {
    return value.format("DD/MM/YYYY HH:mm");
  }

  fila_sas() {
    return this.belongsTo(
      "App/Models/Postgres/MtnEnvolvido",
      "id_envolvido",
      "id"
    );
  }
 

}

module.exports = MtnMensagemSas;
