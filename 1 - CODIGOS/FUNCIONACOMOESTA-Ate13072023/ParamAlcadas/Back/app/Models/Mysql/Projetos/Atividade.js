'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Atividade extends Model {
  static get connection() {
    return 'projetos'
  }

  static get table() {
    return 'atividades'
  }

  //campos do tipo date
  static get dates() {
    return super.dates.concat(['dtInicio', 'dtConclusao', 'dtCriacao', 'dtAtualizacao'])
  }

  //formato de saida das datas
  static castDates(field, value) {
    return value.format("DD/MM/YYYY HH:mm:ss")
  }

  projeto() {
    return this.belongsTo('App/Models/Mysql/Projetos/Projeto', 'idProjeto', 'id');
  }

  funcionalidade() {
    return this.belongsTo('App/Models/Mysql/Projetos/Funcionalidade', 'idFuncionalidade', 'id');
  }

  responsavel() {
    // return this.hasMany('App/Models/Mysql/Projetos/AtividadeResponsavel', 'id', 'idAtividade');
    return this
      .belongsToMany('App/Models/Mysql/Projetos/Responsavel', 'idAtividades', 'idResponsaveis', 'id', 'id')
      .pivotTable('app_projetos.atividades_responsaveis');
  }

  prioridade() {
    return this.hasOne('App/Models/Mysql/Projetos/AtividadePrioridade', 'idPrioridade', 'id');
  }

  complexidade() {
    return this.hasOne('App/Models/Mysql/Projetos/AtividadeComplexidade', 'idComplexidade', 'id');
  }

  grupo() {
    return this.belongsTo('App/Models/Mysql/Projetos/AtividadeGrupo', 'idAtividade', 'id')
  }

  status() {
    return this.hasOne('App/Models/Mysql/Projetos/AtividadeFuncionalidadeProjetoStatus', 'idStatus', 'id');
  }

  tipo() {
    return this.hasOne('App/Models/Mysql/Projetos/AtividadeFuncionalidadeTipo', 'idTipo', 'id');
  }

  esclarecimento() {
    return this.hasMany('App/Models/Mysql/Projetos/Esclarecimento', 'id', 'idAtividade');
  }

  pausa() {
    return this.hasMany('App/Models/Mysql/Projetos/AtividadePausa', 'id', 'idAtividadePausada')
  }

  // teste com tabela pivot
  // pausa() {
  //   return this.belongsToMany('App/Models/Mysql/Projetos/Atividade', 'idAtividade', 'idAtividadePausa', 'id', 'id')
  //     .pivotTable('app_projetos.atividades_atividadesPausas')
  // }

  static get createdAtColumn() {
    return 'dtCriacao';
  }

  static get updatedAtColumn() {
    return 'dtAtualizacao';
  }
}

module.exports = Atividade
