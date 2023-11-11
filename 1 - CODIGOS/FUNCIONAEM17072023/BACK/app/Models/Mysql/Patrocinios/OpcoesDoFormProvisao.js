"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */

const Model = use("Model");

class OpcoesDoFormProvisao extends Model {
  static get connection() {
    return "patrocinios";
  }

  static get table() {
    return "situacaoProvisaoPatrocinios";
  }

  static get createdAtColumn() {
    return null;
  }

  static get updatedAtColumn() {
    return null;
  }

}

module.exports = OpcoesDoFormProvisao;
