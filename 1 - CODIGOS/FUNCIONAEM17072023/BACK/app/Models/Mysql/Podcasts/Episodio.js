'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Episodio extends Model {
  // faz a conexão com o database
  static get connection() {
    return "podcasts";
  }

  // indica qual tabela usar
  static get table() {
    return "episodio";
  }

  tags() {
    return this
    .belongsToMany('App/Models/Mysql/Podcasts/Tag', 'idEpisodio', 'idTag', 'id', 'id')
    .pivotTable('app_podcasts.episodioTag')
  }

  canal() {
    return this
    .hasOne('App/Models/Mysql/Podcasts/Canal', 'idCanal', 'id')
  }

  likes() {
    return this
    .hasMany('App/Models/Mysql/Podcasts/EpisodioLike', 'id', 'idEpisodio')
  }

  // coluna de criação do dado
  static get createdAtColumn() {
    return "createdAt"; //nome da coluna de data de criação do campo na tabela
  }

  // coluna de atualização do dado
  static get updatedAtColumn() {
    return "updatedAt"; //nome da coluna de data de criação do campo na tabela
  }
}

module.exports = Episodio