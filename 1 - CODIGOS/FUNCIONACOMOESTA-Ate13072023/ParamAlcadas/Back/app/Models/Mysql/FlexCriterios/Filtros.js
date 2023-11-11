"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class SolicitacoesFiltros extends Model {
  static get table() {
    return "solicitacoesFiltros";
  }

  static get connection() {
    return "flexCriterios";
  }

  static get createdAtColumn() {
    return null;
  }

  static get updatedAtColumn() {
    return null;
  }
}

module.exports = SolicitacoesFiltros;
