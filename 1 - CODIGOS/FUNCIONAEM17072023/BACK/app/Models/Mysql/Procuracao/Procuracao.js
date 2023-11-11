"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class Procuracao extends Model {
  static get connection() {
    return "procuracao";
  }

  static get table() {
    return "procuracoes";
  }

  //campos do tipo date
  static get dates() {
    return super.dates.concat([
      "dtEmissao",
      "dtValidade",
      "dtManifesto",
      "createdAt",
      "updatedAt",
    ]);
  }

  //formato de saida das datas
  static castDates(field, value) {
    return value.format("DD/MM/YYYY HH:mm");
  }

  historicoDocumento() {
    return this.hasMany(
      "App/Models/Mysql/Procuracao/ProcuracaoOutorgados",
      "id",
      "idProcuracao"
    );
  }

  outorgadoSnapshot() {
    return this.belongsTo(
      "App/Models/Mysql/Procuracao/OutorgadoSnapshot",
      "idOutorgadoSnapshot",
      "id"
    );
  }

  cartorio() {
    return this.hasOne(
      "App/Models/Mysql/Procuracao/Cartorio",
      "idCartorio",
      "id"
    );
  }

  subsidiarias() {
    return this.hasMany(
      "App/Models/Mysql/Procuracao/ProcuracaoSubsidiarias",
      "id",
      "idProcuracao"
    );
  }

  static get createdAtColumn() {
    return "createdAt";
  }

  static get updatedAtColumn() {
    return "updatedAt";
  }
}

module.exports = Procuracao;
