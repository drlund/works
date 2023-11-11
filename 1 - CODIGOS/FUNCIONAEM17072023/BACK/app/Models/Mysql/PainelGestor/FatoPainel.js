'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class FatoPainel extends Model {
  // faz a conexão com o database
  static get connection() {
    return 'painelGestor'
  }

  // indica qual tabela usar
  static get table() {
    return 'fatoPainel'
  }

  //indica os campos do tipo date
  static get dates() {
    return super.dates.concat(['posicaoComponente', 'dataAtualizacao'])
  }

  //formato de saida das datas
  static castDates(field, value) {
    return value.format("DD/MM/YYYY hh:mm:ss")
  }

  //relacionamentos
  // itemTabelaB() {
  //   return this.hasOne('App/Models/Mysql/Dirapp/TabelaB', 'id ou fk da tabelaA(esta model)', 'id ou fk da tabelaB')
  // }

  // //tabela pivot
  // itemTabelaB() {
  //   return this.belongsToMany('App/Models/Mysql/Dirapp/TabelaB', 'idTabelaA', 'idTabelaB', 'id', 'id')
  //     .pivotTable('App/Models/Mysql/Dirapp/TabelaPivot');
  // }

  // coluna de criação do dado
  static get createdAtColumn() {
    return null; //impede a criação automática deste campo na tabela
  }

  // coluna de atualização do dado
  static get updatedAtColumn() {
    return 'dataAtualizacao'; //nome da coluna de data de criação do campo na tabela
  }
}

module.exports = FatoPainel
