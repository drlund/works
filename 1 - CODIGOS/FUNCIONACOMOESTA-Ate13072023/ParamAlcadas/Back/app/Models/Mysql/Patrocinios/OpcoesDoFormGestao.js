"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */

const Model = use("Model");

class OpcoesDoFormGestao extends Model {
  static get connection() {
    return "patrocinios";
  }

  static get table() {
    return "situacaoGestaoPatrocinios";
  }

  static get createdAtColumn() {
    return null;
  }

  static get updatedAtColumn() {
    return null;
  }

  // *** Exemplo de relacionamento 1 pra 1 ***
  // situacao () {
  //   return this.hasOne('App/Models/Mysql/Prefixo', 'pref_orig', 'prefixo')
  // }

}

module.exports = OpcoesDoFormGestao;
