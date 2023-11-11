"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class HistoricoComissoes extends Model {
  static get connection() {
    return "mestreSas";
  }
  static get table() {
    return "tb_historico_comissoes";
  }
  static get primaryKey() {
    return null;
  }

  static get incrementing() {
    return false;
  }

  static get createdAtColumn() {
    return null;
  }

  static get updatedAtColumn() {
    return null;
  }
}

module.exports = HistoricoComissoes;
