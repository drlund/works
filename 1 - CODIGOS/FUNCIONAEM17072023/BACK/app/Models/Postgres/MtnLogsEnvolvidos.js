"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");
const { mtnConsts } = use("Constants");
const { pgSchema } = mtnConsts;

class MtnLogsEnvolvidos extends Model {
  static get connection() {
    return "pgMtn";
  }

  static get table() {
    return `${pgSchema}.logsEnvolvidos`;
  }

  static castDates(field, value) {
    return value.format("DD/MM/YYYY HH:mm");
  }

}

module.exports = MtnLogsEnvolvidos;
