'use strict'


/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')
const {mtnConsts} = use("Constants");
const {pgSchema} = mtnConsts;

class MtnFechadosSemEnvolvidosAnexos extends Model {

  static get connection() {
    return "pgMtn";
  }
  static get incrementing () {
    return false;
  }

  static get primaryKey () {
    return false;
  }

  static get table() {
    return `${pgSchema}.mtns_fechados_sem_envolvidos_anexos`;
  }

  static get createdAtColumn () {
    return null;
  }
  static get updatedAtColumn () {
    return null;
  }

  dadosAnexo(){
    return this.belongsTo('App/Models/Postgres/MtnAnexo', 'id_anexo', 'id');
  }



}

module.exports = MtnFechadosSemEnvolvidosAnexos
