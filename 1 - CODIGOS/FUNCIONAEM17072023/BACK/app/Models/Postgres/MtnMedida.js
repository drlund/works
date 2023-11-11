'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')
const {mtnConsts} = use("Constants");
const {pgSchema} = mtnConsts;


class MtnMedida extends Model {

  static get connection() {
    return "pgMtn";
  }

  static get table() {
    return `${pgSchema}.medidas`;
  }
}

module.exports = MtnMedida
