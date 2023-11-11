'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class ComissoesFot09 extends Model {
  static get table() {
    return 'arhfot09'
  }

  static get connection() {
    return 'dipes'
  }

  static get createdAtColumn() {
    return null
  }

  static get updatedAtColumn() {
    return null
  }

  fot05() {
    return this.hasOne(
      "App/Models/Mysql/Arh/ComissoesFot05",
      "cod_cargo",
      "cod_comissao"
    );
  }

  cargosComissoes () {
    return this.hasOne(
      "App/Models/Mysql/Arh/CargosComissoes",
      "cod_cargo",
      "cd_funcao"
    );
  }
}

module.exports = ComissoesFot09;
