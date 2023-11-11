"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");
const { mtnConsts } = use("Constants");
const { pgSchema } = mtnConsts;

class MtnVisoesVersoesDocumentos extends Model {
  static get connection() {
    return "pgMtn";
  }

  static get table() {
    return `${pgSchema}.visoes_versoes_documentos`;
  }
}

module.exports = MtnVisoesVersoesDocumentos;
