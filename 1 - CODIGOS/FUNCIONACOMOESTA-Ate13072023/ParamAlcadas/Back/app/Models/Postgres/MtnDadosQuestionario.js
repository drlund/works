"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");
const moment = use("moment");
class MtnDadosQuestionario extends Model {
  static get connection() {
    return "pgMtn";
  }

  static get primaryKey() {
    return null;
  }

  static get table() {
    return "app_formularios.tb_dados_questionario";
  }

  static get incrementing() {
    return false;
  }

  static get updatedAtColumn() {
    return null;
  }

  static get createdAtColumn() {
    return null;
  }

  visao() {
    return this.belongsTo("App/Models/Postgres/MtnVisao", "id_visao", "id");
  }
  
}

module.exports = MtnDadosQuestionario;
