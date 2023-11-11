"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class Anexos extends Model {
  static get table() {
    return "anexos";
  }

  static get connection() {
    return "flexCriterios";
  }

  //formato de saida das datas
  static castDates(field, value) {
    return value.format("DD/MM/YYYY hh:mm:ss");
  }

  static get primaryKey() {
    return "id";
  }

  static get createdAtColumn() {
    return "createdAt";
  }

  static get updatedAtColumn() {
    return "updatedAt";
  }

  /*  acao() {
    return this.hasOne("App/Models/Mysql/FlexCriterios/Acoes", "id_acao", "id");
  }

  situacao() {
    return this.hasOne(
      "App/Models/Mysql/FlexCriterios/Situacoes",
      "id_situacao",
      "id"
    );
  } */
}

module.exports = Anexos;
