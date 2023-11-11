'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Canal extends Model {
  // faz a conexão com o database
  static get connection() {
    return "podcasts";
  }

  // indica qual tabela usar
  static get table() {
    return "canal";
  }

  // coluna de criação do dado
  static get createdAtColumn() {
    return "createdAt"; //nome da coluna de data de criação do campo na tabela
  }

  // coluna de atualização do dado
  static get updatedAtColumn() {
    return "updatedAt"; //nome da coluna de data de criação do campo na tabela
  }

  episodio() {
    return this.hasMany('App/Models/Mysql/Podcasts/Episodio', 'id', 'idCanal')
  }

}

module.exports = Canal