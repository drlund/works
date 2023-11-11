'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Estoque extends Model {
  static get connection() {
    return 'encantar';
  }

  static get table() {
    return 'brindesEstoque';
  }

  //campos do tipo date
  static get dates() {
    return super.dates.concat(['createdAt', 'updatedAt'])
  }

  //formato de saida das datas
  static castDates(field, value) {
    return value.format("DD/MM/YYYY hh:mm")
  }

  brinde() {
		return this.belongsTo('App/Models/Mysql/Encantar/Brindes', 'idBrinde', 'id')
  }
  
  lancamentos() {
    return this.hasMany('App/Models/Mysql/Encantar/BrindesEstoqueLancamentos', 'id', 'idBrindesEstoque')
  }
  
	static get createdAtColumn() {
    return null;
  }

  static get updatedAtColumn() {
    return null;
  }
}

module.exports = Estoque
