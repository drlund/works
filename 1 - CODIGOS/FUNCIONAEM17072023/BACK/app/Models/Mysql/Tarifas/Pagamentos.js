"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class Pagamentos extends Model {
  static get connection() {
    return "tarifas";
  }

  static get table() {
    return "pagamentos";
  }

  //campos do tipo date
  static get dates() {
    return super.dates.concat(["createdAt", "updatedAt", "dataPagamento"]);
  }

  //formato de saida das datas
  static castDates(field, value) {
    return value.format("DD/MM/YYYY hh:mm");
  }

  anexos() {
    return this.hasMany(
      "App/Models/Mysql/Tarifas/PagamentosAnexos",
      "id",
      "idPagamento"
    );
  }

  confirmacoes() {
    return this.hasOne(
      "App/Models/Mysql/Tarifas/PagamentosConfirmacao",
      "id",
      "idPagamento"
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

module.exports = Pagamentos;
