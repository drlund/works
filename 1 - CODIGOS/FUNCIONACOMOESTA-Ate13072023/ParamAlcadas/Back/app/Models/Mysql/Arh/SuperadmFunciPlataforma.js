'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class SuperadmFunciPlataforma extends Model {

  static get connection () {
    return 'superadm'
  }

  static get table () {
    return 'plataforma_super_comercial'
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

  gerenciasSuperAdm () {
    return this.hasOne('App/Models/Mysql/Arh/GerenciasSuperAdm','prefixo_plataforma','prefixo')
  }

  mst606PrefixoSuper() {
    return this.hasOne('App/Models/Mysql/Prefixo','prefixo_super','prefixo')
  }

}

module.exports = SuperadmFunciPlataforma;
