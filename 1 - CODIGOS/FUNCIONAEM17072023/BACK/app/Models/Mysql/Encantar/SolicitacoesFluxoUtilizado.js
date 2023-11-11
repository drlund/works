"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class SolicitacoesFluxoUtilizado extends Model {
  static get connection() {
    return "encantar";
  }

  static get table() {
    return "solicitacoesFluxoUtilizado";
  }

  //campos do tipo date
  static get dates() {
    return super.dates.concat(["createdAt", "updatedAt", "finalizadoEm"]);
  }

  //formato de saida das datas
  static castDates(field, value) {
    return value.format("DD/MM/YYYY HH:mm");
  }

  anexos() {
    return this.belongsToMany(
      "App/Models/Mysql/Encantar/Anexos",
      "idSolicitacaoFluxoUtilizado",
      "idAnexo",
      "id",
      "id"
    ).pivotTable("app_encantar.solicitacoesFluxoUtilizadoAnexos");
  }

  static get createdAtColumn() {
    return "createdAt";
  }

  static get updatedAtColumn() {
    return "updatedAt";
  }
}

module.exports = SolicitacoesFluxoUtilizado;
