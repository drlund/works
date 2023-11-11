"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class OperacionalUnidadeAlvo extends Model {
  static get table() {
    return "operacional_unidadeAlvo";
  }

  static get connection() {
    return "flexCriterios";
  }

  static get primaryKey() {
    return "id";
  }

  static get createdAtColumn() {
    return null;
  }

  static get updatedAtColumn() {
    return null;
  }
}

module.exports = OperacionalUnidadeAlvo;