'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class TipoNotificacao extends Model {
  static get connection(){
    return 'mysqlOrdemServico';
  }

  static get table(){
    return 'ordem_tipo_notificacao';
  }
}

module.exports = TipoNotificacao
