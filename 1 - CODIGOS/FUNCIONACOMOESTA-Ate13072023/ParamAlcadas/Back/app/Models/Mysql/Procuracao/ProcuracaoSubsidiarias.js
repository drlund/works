"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class ProcuracaoSubsidiarias extends Model {
  static get connection() {
    return "procuracao";
  }

  static get table() {
    return "procuracao_subsidiarias";
  }

  //formato de saida das datas
  static castDates(field, value) {
    return value.format("DD/MM/YYYY HH:mm");
  }

  procuracao() {
    return this.hasOne(
      "App/Models/Mysql/Procuracao/Procuracao",
      "idProcuracao",
      "id"
    );
  }

  dadosSubsidiaria() {
    return this.hasOne(
      "App/Models/Mysql/Procuracao/Subsidiaria",
      "idSubsidiaria",
      "id"
    );
  }

  static get createdAtColumn() {
    return null;
  }

  static get updatedAtColumn() {
    return null;
  }
}

module.exports = ProcuracaoSubsidiarias;
