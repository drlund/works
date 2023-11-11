'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class ExcecaoQuorum extends Model {
  static get connection() {
    return 'patrocinios';
  }

  static get table() {
    return 'excecoesQuorum';
  }

  static get primaryKey () {
    return 'prefixo';
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

module.exports = ExcecaoQuorum
