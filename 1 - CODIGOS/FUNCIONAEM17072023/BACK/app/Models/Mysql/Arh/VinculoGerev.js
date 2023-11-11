"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class VinculoGerev extends Model {
  static get table() {
    return "vinculo_gerev";
  }

  static get connection() {
    return "superadm";
  }

  static get createdAtColumn() {
    return null;
  }

  static get updatedAtColumn() {
    return null;
  }
}

module.exports = VinculoGerev;
