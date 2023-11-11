"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class EventoPerfilAcesso extends Model {
  // faz a conexão com o database
  static get connection() {
    return "ambiencia";
  }

  // indica qual tabela usar
  static get table() {
    return "eventosPerfilAcesso";
  }

  // coluna de criação do dado
  static get createdAtColumn() {
    return null;
  }

  // coluna de atualização do dado
  static get updatedAtColumn() {
    return null;
  }
}

module.exports = EventoPerfilAcesso;
