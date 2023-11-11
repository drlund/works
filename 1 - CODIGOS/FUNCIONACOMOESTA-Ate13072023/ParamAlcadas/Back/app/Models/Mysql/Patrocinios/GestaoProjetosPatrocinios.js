"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */

const Model = use("Model");

// Acesso à tabela 'gestaoPatrocinios' do BD 'app_patrocinio'
class GestaoProjetosPatrocinios extends Model {
  static get connection() {
    return "patrocinios";
  }

  static get table() {
    return "gestaoPatrocinios";
  }

  static get id(){
    return "id";
  }

  static get createdAtColumn() {
    return "createdAt";
  }

  static get updatedAtColumn() {
    return "updatedAt";
  }

}

module.exports = GestaoProjetosPatrocinios;
