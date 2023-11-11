'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class HistoricoSolicitacaoAcoes extends Model {
	static get connection() {
    return 'encantar';
  }

  static get table() {
    return 'historicoSolicitacaoAcoes';
  }

  static get createdAtColumn() {
    return null;
  }

  static get updatedAtColumn() {
    return null;
  }
}

module.exports = HistoricoSolicitacaoAcoes
