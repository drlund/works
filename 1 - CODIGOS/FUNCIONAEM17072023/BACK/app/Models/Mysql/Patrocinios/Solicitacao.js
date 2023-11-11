"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class Solicitacao extends Model {
  static get connection() {
    return "patrocinios";
  }

  static get table() {
    return "solicitacoes";
  }

  //campos do tipo date
  static get dates() {
    return super.dates.concat([
      "dataInicioEvento",
      "dataFimEvento",
      "dtInclusao",
    ]);
  }

  //formato de saida das datas
  static castDates(field, value) {
    if (["dataInicioEvento", "dataFimEvento"].includes(field)) {
      return value.format("DD/MM/YYYY");
    }
    return value.format("DD/MM/YYYY HH:mm");
  }

  recorrencia() {
    return this.hasOne(
      "App/Models/Mysql/Patrocinios/Recorrencia",
      "id",
      "idSolicitacao"
    );
  }

  nomePrefixo() {
    return this.hasOne(
      "App/Models/Mysql/Dependencia",
      "prefixoSolicitante",
      "prefixo"
    );
  }

  fase() {
    return this.belongsTo("App/Models/Mysql/Patrocinios/Fase", "idFase", "id");
  }

  status() {
    return this.belongsTo(
      "App/Models/Mysql/Patrocinios/Status",
      "idStatus",
      "id"
    );
  }

  voto() {
    return this.hasMany(
      "App/Models/Mysql/Patrocinios/Voto",
      "id",
      "idSolicitacao"
    );
  }

  arquivos() {
    return this.hasMany(
      "App/Models/Mysql/Patrocinios/Arquivos",
      "id",
      "idSolicitacao"
    );
  }

  equipeComunicacao() {
    return this.hasOne(
      "App/Models/Mysql/Patrocinios/EquipeComunicacao",
      "idResponsavel",
      "id"
    );
  }

  gestao(){
    return this.hasMany(
      "App/Models/Mysql/Patrocinios/GestaoTotal",
      "id",
      "idSolicitacao"
    )
  }

  // impede a criação automática deste campo na tabela
  static get createdAtColumn() {
    return null;
  }

  // impede o update automático neste campo na tabela
  static get updatedAtColumn() {
    return null;
  }
}

module.exports = Solicitacao;
