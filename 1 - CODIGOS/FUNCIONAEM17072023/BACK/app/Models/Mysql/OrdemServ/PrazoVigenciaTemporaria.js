'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class PrazoVigenciaTemporaria extends Model {

  static get connection(){
    return 'mysqlOrdemServico';
  }

  static get table(){
    return 'prazo_vigencia_temporaria';
  }

  static get createdAtColumn () {
    return null
  }

  static get updatedAtColumn () {
    return null
  }

}

module.exports = PrazoVigenciaTemporaria
