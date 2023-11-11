'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');

class OptBasica extends Model {

  static get connection() {
    return 'designacao';
  }

  static get table() {
    return 'opts_basicas';
  }

  static get createdAtColumn() {
    return null;
  }

  static get updatedAtColumn() {
    return null;
  }
}

module.exports = OptBasica;
