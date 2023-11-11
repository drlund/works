"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class Solicitacoes extends Model {
  static get table() {
    return "solicitacoes";
  }

  static get connection() {
    return "flexCriterios";
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

  funci() {
    return this.hasOne("App/Models/Mysql/Funci", "matricula", "matricula");
  }

  localizacao() {
    return this.hasOne(
      "App/Models/Mysql/FlexCriterios/Localizacoes",
      "id_localizacao",
      "id"
    );
  }

  prefixoDest() {
    return this.hasOne(
      "App/Models/Mysql/Arh/Prefixo",
      "prefixoDestino",
      "prefixo"
    );
  }

  prefixoOrig() {
    return this.hasOne(
      "App/Models/Mysql/Arh/Prefixo",
      "prefixoOrigem",
      "prefixo"
    );
  }

  status() {
    return this.hasOne(
      "App/Models/Mysql/FlexCriterios/Status",
      "id_status",
      "id"
    );
  }

  etapa() {
    return this.hasOne(
      "App/Models/Mysql/FlexCriterios/Etapas",
      "id_etapa",
      "id"
    );
  }

  analise() {
    return this.hasOne(
      "App/Models/Mysql/FlexCriterios/Analises",
      "id",
      "idSolicitacao"
    );
  }

  tipos() {
    return this.belongsToMany(
      "App/Models/Mysql/FlexCriterios/Tipos",
      "id_solicitacao",
      "id_tipo",
      "id",
      "id"
    ).pivotModel("App/Models/Mysql/FlexCriterios/SolictTipos");
  }

  manifestacoes() {
    return this.hasMany(
      "App/Models/Mysql/FlexCriterios/Manifestacoes",
      "id",
      "id_solicitacao"
    );
  }
  anexos() {
    return this.hasMany(
      "App/Models/Mysql/FlexCriterios/Anexos",
      "id",
      "id_solicitacao"
    );
  }
}

module.exports = Solicitacoes;
