"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class MinutasEmitidas extends Model {
  static get connection() {
    return "procuracao";
  }

  static get table() {
    return "minutas_emitidas";
  }

  //campos do tipo date
  static get dates() {
    return super.dates.concat([
      "createdAt",
      "updatedAt",
    ]);
  }

  //formato de saida das datas
  static castDates(field, value) {
    return value.format("DD/MM/YYYY HH:mm");
  }

  outorgado() {
    return this.hasOne(
      "App/Models/Mysql/Funci",
      "matriculaOutorgado",
      "matricula"
    );
  }

  static get createdAtColumn() {
    return "createdAt";
  }

  static get updatedAtColumn() {
    return "updatedAt";
  }
}

module.exports = MinutasEmitidas;
