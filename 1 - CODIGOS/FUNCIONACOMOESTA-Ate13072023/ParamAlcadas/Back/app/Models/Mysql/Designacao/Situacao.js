'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');

class Situacao extends Model {

  static get connection() {
    return 'designacao';
  }

  static get table() {
    return 'situacoes';
  }

  static get createdAtColumn() {
    return null;
  }

  static get updatedAtColumn() {
    return null;
  }
}

module.exports = Situacao;
