'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class EmailsRotinaNoturna extends Model {

  static get connection(){
    return 'mysqlOrdemServico';
  }

  static get table(){
    return 'ordem_emails_rotina_noturna';
  }

  static get createdAtColumn () {
    return null
  }

  static get updatedAtColumn () {
    return null
  }
}

module.exports = EmailsRotinaNoturna
