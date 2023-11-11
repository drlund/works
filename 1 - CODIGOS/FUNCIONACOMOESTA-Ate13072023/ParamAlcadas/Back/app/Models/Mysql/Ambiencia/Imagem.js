"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class Imagem extends Model {
  // faz a conexão com o database
  static get connection() {
    return "ambiencia";
  }

  // indica qual tabela usar
  static get table() {
    return "tb_imagens";
  }

  //indica os campos do tipo date
  static get dates() {
    return super.dates.concat(["data_inclusao", "data_update"]);
  }

  //formato de saida das datas
  static castDates(field, value) {
    return value.format("DD/MM/YYYY hh:mm:ss");
  }

  //relacionamentos
  ambiente() {
    return this.hasOne("App/Models/Mysql/Ambiencia/ImagemTipo", "tipo", "id");
  }

  // coluna de criação do dado
  static get createdAtColumn() {
    return "createdAt"; //nome da coluna de data de criação do campo na tabela
  }

  // coluna de atualização do dado
  static get updatedAtColumn() {
    return "updatedAt"; //nome da coluna de data de criação do campo na tabela
  }
}

module.exports = Imagem;
