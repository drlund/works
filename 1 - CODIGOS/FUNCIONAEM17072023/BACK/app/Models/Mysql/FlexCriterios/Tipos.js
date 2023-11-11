"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class Tipos extends Model {
  static get table() {
    return "solicitacaoTipos";
  }

  static get connection() {
    return "flexCriterios";
  }

  static get primaryKey() {
    return "id";
  }

  static get createdAtColumn() {
    return null;
  }

  static get updatedAtColumn() {
    return null;
  }

  solicitacoes () {
    return this.belongsToMany('App/Models/Mysql/FlexCriterios/Solicitacoes', 'id_tipo', 'id_solicitacao', 'id', 'id')
      .pivotModel('App/Models/Mysql/FlexCriterios/SolictTipos');
  }
}

module.exports = Tipos;
