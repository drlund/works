'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class MtnFormulario extends Model {

  profile () {
    return this.hasOne('App/Models/Postgres/MtnPergunta')
  }

  static get connection(){
    return 'pgMtn';
  }


  static get primaryKey(){
    return 'id_form';
  }

  static get table(){
    return 'app_formularios.tb_formulario';
  }

  static get incrementing () {
    return false
  }

  perguntas() {
    return this.hasMany("App/Models/Postgres/MtnPergunta","id_form","id_form")
  }

}


module.exports = MtnFormulario
