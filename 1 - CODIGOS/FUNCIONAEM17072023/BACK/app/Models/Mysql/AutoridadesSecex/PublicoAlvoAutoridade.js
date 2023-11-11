'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class PublicoAlvoAutoridade extends Model {
  static get connection() {
    return "appAniversariantes";
  }

  static get table(){
    return 'publico_alvo_autoridades';
  }

  static get primaryKey () {
    return 'matricula'
  }

  dadosFunci() {
    return this.hasOne('App/Models/Mysql/Funci', 'matricula', 'matricula')
  }

  static get createdAtColumn () {
    return null
  }

  static get updatedAtColumn () {
    return null
  }

}

module.exports = PublicoAlvoAutoridade
