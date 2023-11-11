"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class MtnConfigPrazos extends Model {
  static get connection() {
    return "pgMtn";
  }

  static get table() {
    return "novo_mtn.config_prazos";
  }
}

module.exports = MtnConfigPrazos;
