"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class OutorgadoSnapshot extends Model {
  static get connection() {
    return "procuracao";
  }

  static get table() {
    return "outorgado_snapshot";
  }

  //campos do tipo date
  static get dates() {
    return super.dates.concat(["createdAt", "updatedAt"]);
  }

  //formato de saida das datas
  static castDates(field, value) {
    return value.format("DD/MM/YYYY HH:mm");
  }

  cargo() {
    return this.hasOne(
      "App/Models/Mysql/Procuracao/DadosComissao",
      "codigoCargo",
      "codigoCargo"
    );
  }

  static get createdAtColumn() {
    return "createdAt";
  }

  static get updatedAtColumn() {
    return "updatedAt";
  }
}

module.exports = OutorgadoSnapshot;
