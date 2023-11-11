'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class EpisodioLike extends Model {
  // faz a conexão com o database
  static get connection() {
    return "podcasts";
  }

  // indica qual tabela usar
  static get table() {
    return "episodioLike";
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

module.exports = EpisodioLike