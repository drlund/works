"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

const { mtnConsts } = use("Constants");
const { pgSchema } = mtnConsts;
/** @type {typeof import('moment')} */
const moment = use("moment");

class FilaMensagensSas extends Model {
  static get connection() {
    return "pgMtn";
  }

  static get table() {
    return `${pgSchema}.fila_mensagens_sas`;
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
  txt_mensagem(){
    return this.belongsTo(
      "App/Models/Postgres/MtnMensagemSas",
      "id_mensagem",
      "id"
    );
  }

  mtn() {
    return this.belongsTo("App/Models/Postgres/Mtn", "id_mtn", "id");
  }

}

module.exports = FilaMensagensSas;
