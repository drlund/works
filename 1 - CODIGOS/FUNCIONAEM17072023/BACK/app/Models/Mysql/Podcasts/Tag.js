'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Tag extends Model {
  // faz a conexão com o database
  static get connection() {
    return "podcasts";
  }

  // indica qual tabela usar
  static get table() {
    return "tag";
  }

  // coluna de criação do dado
  static get createdAtColumn() {
    return "createdAt";
  }

  // coluna de atualização do dado
  static get updatedAtColumn() {
    return "updatedAt"; 
  }
}

module.exports = Tag