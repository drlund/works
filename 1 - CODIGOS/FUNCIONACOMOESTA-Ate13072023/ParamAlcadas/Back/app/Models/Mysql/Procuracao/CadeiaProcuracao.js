"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class CadeiaProcuracao extends Model {
  static get connection() {
    return "procuracao";
  }

  static get table() {
    return "cadeia_procuracoes";
  }

  //formato de saida das datas
  static castDates(field, value) {
    return value.format("DD/MM/YYYY HH:mm");
  }

  procuracaoAtual() {
    return this.belongsTo(
      "App/Models/Mysql/Procuracao/Procuracao",
      "idProcuracaoAtual",
      "id"
    );
  }
  proxyAtual() {
    return this.belongsTo(
      "App/Models/Mysql/Procuracao/ProxyProcuracao",
      "idProxyAtual",
      "id"
    );
  }

  procuracaoParent() {
    return this.belongsTo(
      "App/Models/Mysql/Procuracao/Procuracao",
      "idProcuracaoParent",
      "id"
    );
  }

  idProxyParent() {
    return this.belongsTo(
      "App/Models/Mysql/Procuracao/ProxyProcuracao",
      "idProxyParent",
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

module.exports = CadeiaProcuracao;
