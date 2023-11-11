'use strict'

const Model = use('Model')
const { mtnConsts } = use("Constants");
const { pgSchema } = mtnConsts;
class MtnVwAguardandoAnalise extends Model {

  static get connection() {
    return "pgMtn";
  }

  static get table() {
    return `${pgSchema}.vw_mtn_aguardando_analise`;
  }

  static castDates(field, value) {
    return value.format("DD/MM/YYYY HH:mm");
  }
}

module.exports = MtnVwAguardandoAnalise