"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class PilotoPrefixo extends Model {
  // faz a conexão com o database
  static get connection() {
    return "painelGestor";
  }

  // indica qual tabela usar
  static get table() {
    return "pilotoPrefixos";
  }

  // coluna de criação do dado
  static get createdAtColumn() {
    return null; //impede a criação automática deste campo na tabela
  }

  // coluna de atualização do dado
  static get updatedAtColumn() {
    return null;
  }
}

module.exports = PilotoPrefixo;
