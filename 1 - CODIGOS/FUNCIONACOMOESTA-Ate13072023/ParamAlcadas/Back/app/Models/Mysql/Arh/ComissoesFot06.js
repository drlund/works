'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Dotacao extends Model {

  //CONFIG
  static get table() {
    return 'arhfot06'
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
      "cod_comissao",
      "cod_comissao"
    );
  }

  gfm () {
    return this.hasOne('App/Models/Mysql/movimentacoes/GruposFuncoes','cod_comissao','cod_funcao')
  }

}

module.exports = Dotacao
