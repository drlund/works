'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Pergunta extends Model {
  static get connection() {
    return 'patrocinios';
  }

  static get table() {
    return 'perguntas';
  }

  //campos do tipo date
  static get dates() {
    return super.dates.concat(['dtAtualizacao'])
  }

  //formato de saida das datas
  static castDates(field, value) {
    return value.format("DD/MM/YYYY hh:mm")
  }

  opcoes() {
    return this.hasMany('App/Models/Mysql/Patrocinios/PerguntasOpcao', 'id', 'idPergunta');
  }

  tipo() {
    return this.hasOne('App/Models/Mysql/Patrocinios/PerguntasTipo', 'idTipoPergunta', 'id')
  }

  resposta() {
    return this.hasOne('App/Models/Mysql/Patrocinios/Resposta', 'id', 'idPergunta')
  }

  // impede a criação automática deste campo na tabela
  static get createdAtColumn() {
    return null;
  }

  // impede o update automático neste campo na tabela
  static get updatedAtColumn() {
    return null;
  }
}

module.exports = Pergunta
