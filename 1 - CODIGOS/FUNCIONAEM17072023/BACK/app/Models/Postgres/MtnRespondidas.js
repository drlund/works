"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class MtnRespostasLog extends Model {
  static get connection() {
    return "pgMtn";
  }

  static get primaryKey() {
    return null;
  }

  static get table() {
    return "app_formularios.tb_respondidas";
  }

}

module.exports = MtnRespostasLog;
