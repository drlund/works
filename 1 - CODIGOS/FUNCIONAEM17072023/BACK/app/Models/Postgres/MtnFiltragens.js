"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");
const { mtnConsts } = use("Constants");
const { pgSchema } = mtnConsts;

class MtnFiltragens extends Model {

  static get connection() {
    return "pgMtn";
  }

  static get table() {
    return `${pgSchema}.filtragens`;
  }

  static get updatedAtColumn () {
    return null
  }

  static castDates(field, value) {
    return value.format("DD/MM/YYYY HH:mm");
  }

}

module.exports = MtnFiltragens;
