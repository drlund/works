'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class MtnTipo extends Model {

  static get connection(){
    return 'pgMtn';
  }
  
  static get table(){
    return 'app_formularios.tb_tipos';
  }

  static get primaryKey(){
    return 'id_tipo;'
  }

  static get incrementing () {
    return false
  }
  
}

module.exports = MtnTipo
