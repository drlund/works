'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class MtnLogAcesso extends Model {
    static get connection(){
        return 'pgMtn';
      }
    
      static get primaryKey(){
        return 'id';
      }
    
      static get table(){
        return 'app_formularios.tb_log_acesso';
      }  

      static get createdAtColumn () {
        return null;
      }
    
      static get updatedAtColumn () {
        return null;
      }    
    
}

module.exports = MtnLogAcesso
