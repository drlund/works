'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Gestores extends Model {

  static get connection(){
    return 'mysqlGestores';
  }

  static get table(){
    return 'tb_gestores';
  }

  static get primaryKey(){
    return 'matricula;'
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

module.exports = Gestores
