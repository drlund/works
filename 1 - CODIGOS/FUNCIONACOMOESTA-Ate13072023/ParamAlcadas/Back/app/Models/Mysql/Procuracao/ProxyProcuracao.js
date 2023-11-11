"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class ProxyProcuracao extends Model {
  static get connection() {
    return "procuracao";
  }

  static get table() {
    return "proxy_procuracao";
  }

  static get primaryKey() {
    return "idProxy";
  }

  procuracao() {
    return this.belongsTo(
      "App/Models/Mysql/Procuracao/Procuracao",
      "idProcuracao",
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

module.exports = ProxyProcuracao;
