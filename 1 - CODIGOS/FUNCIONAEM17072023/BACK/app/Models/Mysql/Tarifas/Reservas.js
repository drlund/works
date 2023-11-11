"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class Reservas extends Model {
  static get connection() {
    return "tarifas";
  }

  static get table() {
    return "reservas";
  }

  //campos do tipo date
  static get dates() {
    return super.dates.concat(["createdAt", "updatedAt"]);
  }

  //formato de saida das datas
  static castDates(field, value) {
    return value.format("DD/MM/YYYY hh:mm");
  }

  dadosPagamento() {
    return this.hasOne(
      "App/Models/Mysql/Tarifas/ReservasDadosPagamento",
      "id",
      "idReserva"
    );
  }

  contatos() {
    return this.hasMany(
      "App/Models/Mysql/Tarifas/ReservasContato",
      "id",
      "idReserva"
    );
  }

  ocorrencia() {
    return this.belongsTo(
      "App/Models/Mysql/Tarifas/Ocorrencias",
      "idPublicoAlvo",
      "id"
    );
  }

  static get createdAtColumn() {
    return "createdAt";
  }

  static get updatedAtColumn() {
    return "updatedAt";
  }
}

module.exports = Reservas;
