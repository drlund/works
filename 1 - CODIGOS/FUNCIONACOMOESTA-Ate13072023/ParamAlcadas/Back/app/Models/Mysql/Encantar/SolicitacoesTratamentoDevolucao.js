"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class SolicitacoesTratamentoDevolucao extends Model {
  static get connection() {
    return "encantar";
  }

  static get table() {
    return "solicitacoesTratamentoDevolucao";
  }

  solicitacao() {
    return this.belongsTo(
      "App/Models/Mysql/Encantar/Solicitacoes",
      "idSolicitacao",
      "id"
    );
  }

  anexos() {
    return this.belongsToMany(
      "App/Models/Mysql/Encantar/Anexos",
      "idTratamentoDevolucao",
      "idAnexo",
      "id",
      "id"
    ).pivotTable("app_encantar.solicitacoesTratamentoDevolucaoAnexos");
  }

  //campos do tipo date
  static get dates() {
    return super.dates.concat(["createdAt", "updatedAt"]);
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

module.exports = SolicitacoesTratamentoDevolucao;
