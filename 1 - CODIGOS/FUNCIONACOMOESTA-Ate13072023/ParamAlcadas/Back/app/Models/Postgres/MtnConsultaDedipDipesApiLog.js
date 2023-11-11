"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");
const { mtnConsts } = use("Constants");
const { pgSchema } = mtnConsts;
/** @type {typeof import('moment')} */
const moment = use("moment");

class MtnConsultaDedipDipesApiLog extends Model {
  // faz a conexão com o database
  static get connection() {
    return "pgMtn";
  }

  // indica qual tabela usar
  static get table() {
    return `${pgSchema}.logs_dedip_api`;
  }

  //formato de saida das datas
  static castDates(field, value) {
    return value.format("DD/MM/YYYY hh:mm:ss");
  }

  // coluna de atualização do dado
  static get updatedAtColumn() {
    return null;
  }
}

module.exports = MtnConsultaDedipDipesApiLog;
