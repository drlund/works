"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class Solicitacao extends Model {
  static get connection() {
    return "patrocinios";
  }

  static get table() {
    return "respostas";
  }

  //campos do tipo date
  static get dates() {
    return super.dates.concat(["dtAtualizacao"]);
  }

  //formato de saida das datas
  static castDates(field, value) {
    return value.format("DD/MM/YYYY hh:mm");
  }

  pergunta() {
    return this.belongsTo(
      "App/Models/Mysql/Patrocinios/Pergunta",
      "idPergunta",
      "id"
    );
  }

  // impede a criação automática deste campo na tabela
  static get createdAtColumn() {
    return null;
  }

  // impede o update automático neste campo na tabela
  static get updatedAtColumn() {
    return ["dtAtualizacao"];
  }
}

module.exports = Solicitacao;
