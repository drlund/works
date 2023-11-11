'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class JurisdicoesSubordinadas extends Model {

  /**
   * @override
   */
  static get connection() {
    return 'mestreSas'
  }

  /**
   * @override
   */
  static get table() {
    return 'tb_jurisdicoes_subordinada'
  }

  /**
   * @override
   * @returns {any}
   */
  static get createdAtColumn() {
    return null; 
  }

  /**
   * @override
   * @returns {any}
   */
  static get updatedAtColumn() {
    return null; 
  }
}

module.exports = JurisdicoesSubordinadas