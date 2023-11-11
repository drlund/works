"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class JurisdicoesSubordinadas extends Model {
  static get connection() {
    return "mestreSas";
  }

  static get table() {
    return "tb_jurisdicoes_subordinada";
  }

  prefixo_mst () {
    return this.hasOne('App/Models/Mysql/Arh/Prefixo', 'prefixo', 'prefixo')
  }

  prefixo_subord_mst () {
    return this.hasOne('App/Models/Mysql/Arh/Prefixo', 'prefixo_subordinada', 'prefixo')
  }

  static get primaryKey() {
    return null;
  }

  static get incrementing() {
    return false;
  }

  static get createdAtColumn() {
    return null;
  }

  static get updatedAtColumn() {
    return null;
  }
}

module.exports = JurisdicoesSubordinadas;
