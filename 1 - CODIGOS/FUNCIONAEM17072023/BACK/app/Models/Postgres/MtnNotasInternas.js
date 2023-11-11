"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");
const { mtnConsts } = use("Constants");
const { pgSchema } = mtnConsts;

class MtnNotasInternas extends Model {
  static get connection() {
    return "pgMtn";
  }

  static get table() {
    return `${pgSchema}.envolvidos_notas_internas`;
  }

  static get dates() {
    return super.dates.concat(["created_at", "updated_at"]);
  }

  static castDates(field, value) {
    return value.format("DD/MM/YYYY HH:mm:ss");
  }

  notasInternasLidas() {
    return this.hasMany(
      "App/Models/Postgres/MtnNotasInternasLeitura",
      "id",
      "id_nota_interna"
    )
  }
}

module.exports = MtnNotasInternas;
