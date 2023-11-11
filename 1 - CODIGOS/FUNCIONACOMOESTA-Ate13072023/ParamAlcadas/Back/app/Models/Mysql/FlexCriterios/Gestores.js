"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class Gestores extends Model {
  static get table() {
    return "gestores";
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
      "id_gestor",
      "id_unidade",
      "id",
      "id"
    ).pivotModel("App/Models/Mysql/FlexCriterios/GestorUnidadeAlvo");
  }
}

module.exports = Gestores;
