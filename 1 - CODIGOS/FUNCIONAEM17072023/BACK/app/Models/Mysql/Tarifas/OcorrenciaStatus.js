"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class OcorrenciaStatus extends Model {
  static get connection() {
    return "tarifas";
  }

  static get table() {
    return "publicoAlvoStatus";
  }

  //campos do tipo date
  static get dates() {
    return super.dates.concat(["createdAt", "updatedAt"]);
  }

  //formato de saida das datas
  static castDates(field, value) {
    return value.format("DD/MM/YYYY hh:mm");
  }

  status(){
    return this.belongsTo(
      "App/Models/Mysql/Tarifas/Status",
      "idStatus",
      "id"
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

module.exports = OcorrenciaStatus;
