"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");
const { mtnConsts } = use("Constants");
const { pgSchema } = mtnConsts;

class MtnComiteExpandido extends Model {
  static get connection() {
    return "pgMtn";
  }

  static get table() {
    return `${pgSchema}.visoes_comite_expandido`;
  }

  static castDates(field, value) {
    return value.format("DD/MM/YYYY HH:mm");
  }
}

module.exports = MtnComiteExpandido;
