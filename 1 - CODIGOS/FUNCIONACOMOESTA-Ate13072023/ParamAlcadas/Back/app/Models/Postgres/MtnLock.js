"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");
const { mtnConsts } = use("Constants");
const { pgSchema } = mtnConsts;

class MtnLock extends Model {
  static get connection() {
    return "pgMtn";
  }

  static get table() {
    return `${pgSchema}.locks`;
  }

  static get dates() {
    return super.dates.concat(["renovado_em"]);
  }

  static castDates(field, value) {
    return value.format("DD/MM/YYYY HH:mm");
  }


  mtn(){
    return this.belongsTo('App/Models/Postgres/Mtn', 'id_mtn', 'id');
  }

}

module.exports = MtnLock;
