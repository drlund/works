'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class ADDescricao extends Model {
  static get connection() {
    return 'projetos'
  }

  static get table() {
    return 'ADDescricao'
  }

  //campos do tipo date
  static get dates() {
    return super.dates.concat(['dtCriacao', 'dtAtualizacao'])
  }

  //formato de saida das datas
  static castDates(field, value) {
    return value.format("DD/MM/YYYY hh:mm")
  }

  static get createdAtColumn() {
    return 'dtCriacao';
  }

  static get updatedAtColumn() {
    return 'dtAtualizacao';
  }

  projeto() {
    return this.hasOne('App/Models/Mysql/Projetos/Projeto', 'id', 'idProjeto');
  }

  usuarioComum() {
    return this.hasOne('App/Models/Mysql/Projetos/ADUsuarioComum', 'id', 'idUsuariosComuns');
  }

  usuarioExecutante() {
    return this.hasOne('App/Models/Mysql/Projetos/ADUsuarioExecutante', 'id', 'idUsuariosExecutantes');
  }

  dadosPF() {
    return this.hasOne('App/Models/Mysql/Projetos/ADDadosPF', 'id', 'idDadosPF');
  }

  tempoGuarda() {
    return this.hasOne('App/Models/Mysql/Projetos/ADDadosTempoGuarda', 'id', 'idTempoGuarda');
  }

  listaProspeccao() {
    return this.hasOne('App/Models/Mysql/Projetos/ADListaProspeccao', 'id', 'idListaProspeccao');
  }

  risco() {
    return this.hasOne('App/Models/Mysql/Projetos/AtividadeComplexidade', 'id', 'idRisco_Complexidade');
  }

  classificacao() {
    return this.hasOne('App/Models/Mysql/Projetos/ADClassificacao', 'id', 'idClassificacao');
  }

  conformidade() {
    return this.hasOne('App/Models/Mysql/Projetos/ADConformidade', 'id', 'idConformidade');
  }
}

module.exports = ADDescricao
