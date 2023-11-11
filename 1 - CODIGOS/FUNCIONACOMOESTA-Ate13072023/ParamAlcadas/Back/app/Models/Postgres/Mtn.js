"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

const { mtnConsts } = use("Constants");
const { pgSchema } = mtnConsts;
/** @type {typeof import('moment')} */
const moment = use("moment");
class Mtn extends Model {
  static get connection() {
    return "pgMtn";
  }

  static get table() {
    return `${pgSchema}.mtns`;
  }

  static castDates(field, value) {
    return value.format("DD/MM/YYYY HH:mm");
  }

  getCreatedAt(created_at) {
    return moment(created_at).format("DD/MM/YYYY HH:mm");
  }

  visao() {
    return this.belongsTo("App/Models/Postgres/MtnVisao", "id_visao", "id");
  }

  status() {
    return this.belongsTo("App/Models/Postgres/MtnStatus", "id_status", "id");
  }

  fechadoSemEnvolvido(){
    return this.hasOne("App/Models/Postgres/MtnFechadoSemEnvolvido", "id", "id_mtn")
  }

  envolvidos() {
    return this.hasMany("App/Models/Postgres/MtnEnvolvido", "id", "id_mtn");
  }

  lock() {
    return this.hasOne("App/Models/Postgres/MtnLock", "id", "id_mtn");
  }

  vwPendentesSuper(){
    
    return this.hasMany("App/Models/Postgres/VwMtnPendentesSuper", "id", "id_mtn");
  }
}

module.exports = Mtn;
