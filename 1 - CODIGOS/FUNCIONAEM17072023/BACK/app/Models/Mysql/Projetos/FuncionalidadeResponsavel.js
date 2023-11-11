'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class FuncionalidadeResponsavel extends Model {
  static get connection() {
    return 'projetos'
  }

  static get table() {
    return 'funcionalidadesResponsavel'
  }

  //campos do tipo date
  static get dates() {
    return super.dates.concat(['dtCriacao', 'dtAtualizacao'])
  }

  //formato de saida das datas
  static castDates(field, value) {
    return value.format("DD/MM/YYYY hh:mm")
  }

  funcionalidade() {
    return this.hasMany('App/Models/Mysql/Projetos/Funcionalidade', 'idFuncionalidade', 'id');
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

module.exports = FuncionalidadeResponsavel
