'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Funcionalidade extends Model {
  static get connection() {
    return 'projetos'
  }

  static get table() {
    return 'funcionalidades'
  }

  //campos do tipo date
  static get dates() {
    return super.dates.concat(['dtPrevisaoConclusao', 'dtConclusao', 'dtCriacao', 'dtAtualizacao'])
  }

  //formato de saida das datas
  static castDates(field, value) {
    return value.format("DD/MM/YYYY HH:mm")
  }

  projeto() {
    return this.belongsTo('App/Models/Mysql/Projetos/Projeto', 'idProjeto', 'id');
  }

  responsavel() {
    return this
      .belongsToMany('App/Models/Mysql/Projetos/Responsavel', 'idFuncionalidades', 'idResponsaveis', 'id', 'id')
      .pivotTable('app_projetos.funcionalidades_responsaveis')
  }

  status() {
    return this.hasOne('App/Models/Mysql/Projetos/AtividadeFuncionalidadeProjetoStatus', 'idStatus', 'id');
  }

  tipo() {
    return this.hasOne('App/Models/Mysql/Projetos/AtividadeFuncionalidadeTipo', 'idTipo', 'id');
  }

  // esclarecimento() {
  //   return this.hasMany('App/Models/Mysql/Projetos/AtividadeFuncionalidadeEsclarecimento', 'id', 'idFuncionalidade');
  // }

  // atividade() {
  //   return this.belongsToMany('App/Models/Mysql/Projetos/Atividade', 'idRequisito', 'idAtividade', 'id', 'id')
  //     .pivotTable('App/Models/Mysql/Projetos/AtividadeRequisito');
  // }

  static get createdAtColumn() {
    return 'dtCriacao';
  }

  static get updatedAtColumn() {
    return 'dtAtualizacao';
  }
}

module.exports = Funcionalidade
