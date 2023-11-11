"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class InabilitadosTCU extends Model {
  static get connection() {
    return "movimentacoes";
  }

  // indica qual tabela usar
  static get table() {
    return "tcu_inabilitados";
  }

  static get createdAtColumn() {
    return null;
  }

  static get updatedAtColumn() {
    return null;
  }
}

module.exports = InabilitadosTCU;
