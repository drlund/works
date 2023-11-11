"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class PrimeiroGestor extends Model {
  static get connection() {
    return "superadm";
  }

  static get table() {
    return "responsavel_d1";
  }

  dadosFunci() {
    return this.hasOne("App/Models/Mysql/Funci", "matricula", "matricula");
  }
}

module.exports = PrimeiroGestor;
