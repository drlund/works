"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class FilaGlobal extends Model {
  static get connection() {
    return "filaEmails";
  }

  static get table() {
    return "filaGlobal";
  }
  //campos do tipo date
  static get dates() {
    return super.dates.concat(["createdAt", "updatedAt", "enviadoEm"]);
  }

  //formato de saida das datas
  static castDates(field, value) {
    return value.format("DD/MM/YYYY hh:mm");
  }

  static get createdAtColumn() {
    return "createdAt";
  }

  static get updatedAtColumn() {
    return "updatedAt";
  }
}

module.exports = FilaGlobal;
