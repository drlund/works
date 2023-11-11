'use strict'

const Model = use('Model')
const { mtnConsts } = use("Constants");
const { pgSchema } = mtnConsts;
class MtnPeopleAnalitics extends Model {

  static get connection() {
    return "pgMtn";
  }

  static get table() {
    return `${pgSchema}.vw_matriz_pa_v2`;
  }

  static castDates(field, value) {
    return value.format("DD/MM/YYYY HH:mm");
  }
}

module.exports = MtnPeopleAnalitics
