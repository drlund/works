'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Projeto extends Model {

  static get connection() {
    return 'projetos'
  }

  static get table() {
    return 'projetos'
  }

  //campos do tipo date
  static get dates() {
    return super.dates.concat(['dtInicio', 'dtPrevisaoConclusao', 'dtConclusao', 'dtCriacao', 'dtAtualizacao'])
  }

  //formato de saida das datas
  static castDates(field, value) {
    return value.format("DD/MM/YYYY HH:mm")
  }

  responsavel() {
    return this
      .belongsToMany('App/Models/Mysql/Projetos/Responsavel', 'idProjetos', 'idResponsaveis', 'id', 'id')
      .pivotTable('app_projetos.projetos_responsaveis')
  }

  responsavelData() {
    return this
      .hasOne('App/Models/Mysql/Arh/Funci', 'matriculaSolicitante', 'matricula')
  }

  funcionalidade() {
    return this.hasMany('App/Models/Mysql/Projetos/Funcionalidade', 'id', 'idProjeto');
  }

  anexo() {
    return this.hasMany('App/Models/Mysql/Projetos/Anexo', 'id', 'idProjeto');
  }

  timeline() {
    return this.hasMany('App/Models/Mysql/Projetos/ProjetoTimeline', 'id', 'idProjeto');
  }

  atividade() {
    return this.hasMany('App/Models/Mysql/Projetos/Atividade', 'id', 'idProjeto');
  }

  conhecimento() {
    return this.hasOne('App/Models/Mysql/Projetos/BaseConhecimento', 'id', 'idProjeto');
  }

  esclarecimento() {
    return this.hasMany('App/Models/Mysql/Projetos/Esclarecimento', 'id', 'idProjeto');
  }

  problema() {
    return this.hasMany('App/Models/Mysql/Projetos/ProblemaConhecido', 'id', 'idProjeto');
  }

  status() {
    return this.hasOne('App/Models/Mysql/Projetos/AtividadeFuncionalidadeProjetoStatus', 'idStatus', 'id');
  }

  static get createdAtColumn() {
    return 'dtCriacao';
  }

  static get updatedAtColumn() {
    return 'dtAtualizacao';
  }
}

module.exports = Projeto
