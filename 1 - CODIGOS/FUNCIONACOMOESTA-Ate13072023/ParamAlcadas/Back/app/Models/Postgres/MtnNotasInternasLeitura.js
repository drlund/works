"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");
const { mtnConsts } = use("Constants");
const { pgSchema } = mtnConsts;

class MtnNotasInternasLeitura extends Model {
  static get connection() {
    return "pgMtn";
  }

  static get table() {
    return `${pgSchema}.envolvidos_notas_internas_leitura`;
  }

  static get dates() {
    return super.dates.concat(["data_leitura", "created_at", "updated_at"]);
  }

  static castDates(field, value) {
    return value.format("DD/MM/YYYY HH:mm:ss");
  }
}

module.exports = MtnNotasInternasLeitura;
