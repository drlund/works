"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class EventoAvaliacao extends Model {
  // faz a conexão com o database
  static get connection() {
    return "ambiencia";
  }

  // indica qual tabela usar
  static get table() {
    return "eventosAvaliacoes";
  }

  //indica os campos do tipo date
  static get dates() {
    return super.dates.concat(["createdAt", "updatedAt"]);
  }

  //formato de saida das datas
  static castDates(field, value) {
    return value.format("DD/MM/YYYY hh:mm:ss");
  }

  //relacionamentos
  evento() {
    return this.hasOne("App/Models/Mysql/Ambiencia/Evento", "id", "idEvento");
  }

  ambienteTipo() {
    return this.hasOne(
      "App/Models/Mysql/Ambiencia/ImagemTipo",
      "id",
      "idImagemTipo"
    );
  }

  regraAmbiente() {
    return this.hasOne(
      "App/Models/Mysql/Ambiencia/EventoRegrasAmbiente",
      "idRegraAmbiente",
      "id"
    );
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

module.exports = EventoAvaliacao;
