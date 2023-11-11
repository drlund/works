"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */

const Model = use("Model");

// Acesso à tabela 'gestaoPatrocinios' do BD 'app_patrocinio'
class GestaoPagamentosPatrocinios extends Model {
  static get connection() {
    return "patrocinios";
  }

  static get table() {
    return "pagamentosPatrocinios";
  }

  //formato de saída das datas
  static castDates(field, value) {
    return value.format("DD/MM/YYYY hh:mm")
  }

  static get createdAtColumn() {
    return "createdAt";
  }

  static get updatedAtColumn() {
    return "updatedAt";
  }

}

module.exports = GestaoPagamentosPatrocinios;
