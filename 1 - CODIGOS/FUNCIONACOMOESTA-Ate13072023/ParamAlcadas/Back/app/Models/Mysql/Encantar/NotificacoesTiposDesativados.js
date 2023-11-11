"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class NotificacoesTiposDesativados extends Model {
  static get connection() {
    return "encantar";
  }

  static get dates() {
    return super.dates.concat(["createdAt", "updatedAt"]);
  }

  static castDates(field, value) {
    return value.format("DD/MM/YYYY HH:mm");
  }

  static get table() {
    return "notificacoesTiposDesativados";
  }

  static get createdAtColumn() {
    return "createdAt";
  }

  static get updatedAtColumn() {
    return "updatedAt";
  }
}

module.exports = NotificacoesTiposDesativados;
