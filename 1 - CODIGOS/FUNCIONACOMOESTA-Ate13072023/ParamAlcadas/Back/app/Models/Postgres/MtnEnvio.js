'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class MtnEnvio extends Model {

    static get connection(){
        return 'pgMtn';
      }
    
      static get primaryKey(){
        return false;
      }
    
      static get table(){
        return 'app_formularios.tb_envio_emails';
      }
    
      static get incrementing () {
        return false
      }
    
      static get updatedAtColumn () {
        return 'ts_resposta'
      }
    
}

module.exports = MtnEnvio
