"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class Pagamentos extends Model {
  static get connection() {
    return "tarifas";
  }

  static get table() {
    return "pagamentoConfirmacao";
  }

  //campos do tipo date
  static get dates() {
    return super.dates.concat(["createdAt", "updatedAt"]);
  }

  //formato de saida das datas
  static castDates(field, value) {
    return value.format("DD/MM/YYYY hh:mm");
  }

  pagamento() {
    return this.belongsTo(
      "App/Models/Mysql/Tarifas/Pagamento",
      "idPagamento",
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
