"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */

const Model = use("Model");

// Acesso à tabela 'gestaoPatrocinios' do BD 'app_patrocinio'
class GestaoOrcamentoPatrocinios extends Model {
  static get connection() {
    return "patrocinios";
  }

  static get table() {
    return "orcamentoPatrocinios";
  }

  static get createdAtColumn() {
    return "createdAt";
  }

  static get updatedAtColumn() {
    return "updatedAt";
  }

}

module.exports = GestaoOrcamentoPatrocinios;
