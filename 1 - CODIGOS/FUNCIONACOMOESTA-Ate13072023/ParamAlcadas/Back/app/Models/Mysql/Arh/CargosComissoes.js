'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class CargosComissoes extends Model {
  static get connection () {
    return 'superadm'
  }

  static get table () {
    return 'cargos_e_comissoes'
  }

  static get primaryKey () {
    return 'cod_funcao'
  }

  getNomeFuncao(value) {
    return value.trim()
  }

  fot09 () {
    return this.hasOne(
      "App/Models/Mysql/Arh/ComissoesFot09",
      "cod_comissao",
      "cod_cargo"
    );
  }

  gerev () {
    return this.hasOne(
      "App/Models/Mysql/Arh/VinculoGerev",
      "cod_comissao",
      "cod_cargo"
    );
  }

  static get incrementing () {
    return false
  }

  static get createdAtColumn () {
    return null
  }

  static get updatedAtColumn () {
    return null
  }

}

module.exports = CargosComissoes
