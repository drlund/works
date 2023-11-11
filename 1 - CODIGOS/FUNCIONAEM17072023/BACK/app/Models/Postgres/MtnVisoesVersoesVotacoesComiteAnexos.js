"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");
const { mtnConsts } = use("Constants");
const { pgSchema } = mtnConsts;

class MtnVisoesVersoesVotacoesComiteAnexos extends Model {
  static get connection() {
    return "pgMtn";
  }

  static get primaryKey() {
    return false;
  }

  static get createdAtColumn() {
    return null;
  }
  static get updatedAtColumn() {
    return null;
  }

  dadosAnexo() {
    return this.belongsTo("App/Models/Postgres/MtnAnexo", "id_anexo", "id");
  }

  anexos() {
    return this.belongsToMany(
      "App/Models/Postgres/MtnAnexo",
      "id_anexo",
      "id_versao_votacoes_comite",
      "id",
      "id"
    ).pivotTable(`${pgSchema}.visoes_versoes_votacoes_comite_anexos`);
  }

  static get table() {
    return `${pgSchema}.visoes_versoes_votacoes_comite_anexos`;
  }
}

module.exports = MtnVisoesVersoesVotacoesComiteAnexos;
