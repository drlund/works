'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Funcionalidade extends Model {
  static get connection() {
    return 'projetos'
  }

  static get table() {
    return 'anexos'
  }

  //campos do tipo date
  static get dates() {
    return super.dates.concat(['dtCriacao', 'dtAtualizacao'])
  }

  //formato de saida das datas
  static castDates(field, value) {
    return value.format("DD/MM/YYYY HH:mm")
  }

  projeto() {
    return this.belongsTo('App/Models/Mysql/Projetos/Projeto', 'idProjeto', 'id');
  }

  static get createdAtColumn() {
    return 'dtCriacao';
  }

  static get updatedAtColumn() {
    return 'dtAtualizacao';
  }
}

module.exports = Funcionalidade
