"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class OperacionalGestor extends Model {
  static get table() {
    return "operacionalGestor";
  }

  static get connection() {
    return "flexCriterios";
  }

  static get primaryKey() {
    return "id";
  }

  unidadesAlvo() {
    return this.belongsToMany(
      "App/Models/Mysql/FlexCriterios/UnidadesAlvo",
      "id_operacional",
      "id_unidadeAlvo",
      "id",
      "id"
    ).pivotModel("App/Models/Mysql/FlexCriterios/OperacionalUnidadeAlvo");
  }

  /*   static get createdAtColumn() {
    return "createdAt";
  }

  static get updatedAtColumn() {
    return "updatedAt";
  } */
}

module.exports = OperacionalGestor;
