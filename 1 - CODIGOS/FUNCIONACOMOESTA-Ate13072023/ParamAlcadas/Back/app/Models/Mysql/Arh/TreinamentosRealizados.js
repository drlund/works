"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class TreinamentosRealizados extends Model {
  static get connection() {
    return "dipes";
  }

  static get table() {
    return "arhp9050_treinamentosrealizados";
  }

  static get primaryKey() {
    return "codigo";
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

module.exports = TreinamentosRealizados;
