'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class MtnPergunta extends Model {

  static get connection(){
    return 'pgMtn';
  }

  static get primaryKey(){
    return 'id_form;'
  }

  static get table(){
    return 'app_formularios.tb_pergunta';
  }

  static get incrementing () {
    return false
  }

  tipo(){
    return this.hasOne("App/Models/Postgres/MtnTipo","id_tipo","id_tipo");
  }

  formulario() {
    return this.belongsTo("App/Models/Postgres/MtnFormulario","id_form", "id_form")
  }
  
}

module.exports = MtnPergunta
