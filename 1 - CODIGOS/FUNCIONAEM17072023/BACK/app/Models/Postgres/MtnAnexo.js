'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')
const {mtnConsts} = use("Constants");
const {pgSchema} = mtnConsts;
const moment = use("moment");

class MtnAnexo extends Model {
  static get connection() {
    return "pgMtn";
  }

  static get table() {
    return `${pgSchema}.anexos`;
  }

}

module.exports = MtnAnexo
