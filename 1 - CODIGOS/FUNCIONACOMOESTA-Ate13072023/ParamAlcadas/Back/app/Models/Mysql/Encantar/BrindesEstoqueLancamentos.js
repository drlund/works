'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class BrindesEstoqueLancamentos extends Model {
  static get connection() {
    return 'encantar';
  }

  static get table() {
    return 'brindesEstoqueLancamentos';
  }

  //campos do tipo date
  static get dates() {
    return super.dates.concat(['createdAt', 'updatedAt'])
  }

  //formato de saida das datas
  static castDates(field, value) {
    return value.format("DD/MM/YYYY hh:mm")
  }

  estoque() {
		return this.belongsTo('App/Models/Mysql/Encantar/BrindesEstoque', 'idBrindesEstoque', 'id')
  }
  
  tipoLcto() {
		return this.belongsTo('App/Models/Mysql/Encantar/BrindesTipoLancamento', 'idTipoLancamentos', 'id')
	}
	
	static get createdAtColumn() {
    return 'createdAt';
  }

  static get updatedAtColumn() {
    return 'updatedAt';
  }
}

module.exports = BrindesEstoqueLancamentos
