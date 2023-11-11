"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class OrdemManifestacoes extends Model {
  static get table() {
    return "ordemManifestacoes";
  }

  static get connection() {
    return "flexCriterios";
  }

  static get primaryKey() {
    return "id";
  }

  static get createdAtColumn() {
    return "createdAt";
  }

  static get updatedAtColumn() {
    return "updatedAt";
  }
}

module.exports = OrdemManifestacoes;
