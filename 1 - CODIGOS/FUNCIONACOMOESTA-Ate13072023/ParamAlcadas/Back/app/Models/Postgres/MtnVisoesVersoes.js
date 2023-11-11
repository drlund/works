"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");
const { mtnConsts } = use("Constants");
const { pgSchema } = mtnConsts;

class MtnVisoesVersoes extends Model {
  static get connection() {
    return "pgMtn";
  }

  static get table() {
    return `${pgSchema}.visoes_versoes`;
  }

  visao() {
    return this.hasOne("App/Models/Postgres/MtnVisao", "visao_id", "id");
  }

  status() {
    return this.hasOne(
      "App/Models/Postgres/MtnVisoesVersoesStatus",
      "status_versao_id",
      "id"
    );
  }

  comite() {
    return this.hasMany(
      "App/Models/Postgres/MtnVisoesVersoesVotacoesComite",
      "id",
      "versao_id"
    );
  }

  votacoesRecusadas() {
    return this.hasMany(
      "App/Models/Postgres/MtnVisoesVotacoesRecusadas",
      "id",
      "versao_id"
    );
  }

  documento() {
    return this.hasOne(
      "App/Models/Postgres/MtnVisoesVersoesDocumentos",
      "versao_documento_id",
      "id"
    );
  }
}

module.exports = MtnVisoesVersoes;
