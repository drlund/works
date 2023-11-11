'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class RespAnalise extends Model {
  static get connection() {
    return 'patrocinios';
  }

  static get table() {
    return 'respAnalise';
  }

  // impede a criação automática deste campo na tabela
  static get createdAtColumn() {
    return null;
  }

  // impede o update automático neste campo na tabela
  static get updatedAtColumn() {
    return null;
  }
}

module.exports = RespAnalise
