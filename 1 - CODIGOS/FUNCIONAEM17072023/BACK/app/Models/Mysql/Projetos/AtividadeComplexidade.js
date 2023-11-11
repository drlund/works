'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class AtividadeComplexidade extends Model {
  static get connection() {
    return 'projetos'
  }

  static get table() {
    return 'atividadesComplexidade'
  }

  //campos do tipo date
  static get dates() {
    return super.dates.concat(['dtCriacao', 'dtAtualizacao'])
  }

  //formato de saida das datas
  static castDates(field, value) {
    return value.format("DD/MM/YYYY hh:mm")
  }

  // impede a criação automática deste campo na tabela
  static get createdAtColumn() {
    return 'dtCriacao';
  }

  // impede o update automático neste campo na tabela
  static get updatedAtColumn() {
    return 'dtAtualizacao';
  }
}

module.exports = AtividadeComplexidade
