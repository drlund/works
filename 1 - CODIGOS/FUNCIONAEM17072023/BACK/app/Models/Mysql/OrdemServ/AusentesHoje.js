'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class AusentesHoje extends Model {
  static get connection(){
    return 'mysqlOrdemServico';
  }

  static get table(){
    return 'vw_ausentes_hoje';
  }
}

module.exports = AusentesHoje
