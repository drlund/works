'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class ProjetoResponsavel extends Model {
  static get connection() {
    return 'projetos'
  }

  static get table() {
    return 'responsaveis'
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
    return this
      .belongsToMany('App/Models/Mysql/Projetos/Projeto', 'idResponsaveis', 'idProjetos', 'id', 'id')
      .pivotTable('app_projetos.projetos_responsaveis')
  }

  responsavelData() {
    return this
      .hasOne('App/Models/Mysql/Arh/Funci', 'matricula', 'matricula')
  }

  funcionalidade() {
    return this
      .belongsToMany('App/Models/Mysql/Projetos/Funcionalidade', 'idResponsaveis', 'idFuncionalidades', 'id', 'id')
      .pivotTable('app_projetos.funcionalidades_responsaveis')
  }

  atividade() {
    return this
      .belongsToMany('App/Models/Mysql/Projetos/Atividade', 'idResponsaveis', 'idAtividades', 'id', 'id')
      .pivotTable('app_projetos.atividades_responsaveis')
  }

  static get createdAtColumn() {
    return 'dtCriacao';
  }

  static get updatedAtColumn() {
    return 'dtAtualizacao';
  }
}

module.exports = ProjetoResponsavel
