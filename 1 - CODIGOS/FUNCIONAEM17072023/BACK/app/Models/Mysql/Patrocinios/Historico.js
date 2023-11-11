"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class Solicitacao extends Model {
  static get connection() {
    return "patrocinios";
  }

  static get table() {
    return "historicos";
  }

  //campos do tipo date
  static get dates() {
    return super.dates.concat(["dtCriacao"]);
  }

  //formato de saida das datas
  static castDates(field, value) {
    return value.format("DD/MM/YYYY HH:mm:ss");
  }

  static get hidden() {
    return ["id", "idAcao", "dados", "dtAtualizacao"];
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
