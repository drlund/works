"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");
const { mtnConsts } = use("Constants");
const { pgSchema } = mtnConsts;
/** @type {typeof import('moment')} */
const moment = use("moment");

class LogsAusencias extends Model {
  static get connection() {
    return "pgMtn";
  }

  static get table() {
    return `${pgSchema}.logs_ausencias`;
  }


 
}

module.exports = LogsAusencias;
