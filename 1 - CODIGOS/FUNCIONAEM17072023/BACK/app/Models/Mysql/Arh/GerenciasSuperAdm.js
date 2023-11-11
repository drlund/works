'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class GerenciasSuperAdm extends Model {

  //CONFIG
  static get table() {
    return 'gerencias_super_adm'
  }

  static get connection() {
    return 'superadm'
  }

  static get createdAtColumn() {
    return null
  }

  static get updatedAtColumn() {
    return null
  }

  plataformas() {
    return this.hasMany('App/Models/Mysql/Arh/SuperadmFunciPlataforma', 'prefixo', 'prefixo_plataforma')
  }

  mstd501ePrefixo() {
    return this.hasOne('App/Models/Mysql/Arh/Mstd501e','uor','CodigoIORdaUORJurisdicionante')
  }

}

module.exports = GerenciasSuperAdm;
