"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");
/** @type {typeof import('moment')} */
const moment = use("moment");

const {mtnConsts} = use("Constants");
const {pgSchema} = mtnConsts;

class ForaAlcadaFuncionarios extends Model {
  static get connection() {
    return "pgMtn";
  }

  static get table() {
    return `${pgSchema}.fora_alcada_funcionarios`;
  }

  static castDates(field, value) {
    return value.format("DD/MM/YYYY HH:mm");
  }  
  
}

module.exports = ForaAlcadaFuncionarios;