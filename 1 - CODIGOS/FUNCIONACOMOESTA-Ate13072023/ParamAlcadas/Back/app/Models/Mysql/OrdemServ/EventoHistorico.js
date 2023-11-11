'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class EventoHistorico extends Model {
  static get connection(){
    return 'mysqlOrdemServico';
  }

  static get table(){
    return 'ordem_evento_historico';
  }
}

module.exports = EventoHistorico
