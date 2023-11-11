'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');

class Negativa extends Model {

  static get connection() {
    return 'designacao';
  }

  static get table() {
    return 'negativas';
  }

  static get createdAtColumn() {
    return null;
  }

  static get updatedAtColumn() {
    return null;
  }
}

module.exports = Negativa;
