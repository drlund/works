'use strict'

const Model = use('Model')
const { mtnConsts } = use("Constants");
const { pgSchema } = mtnConsts;
class MtnQuestionarioView extends Model {

  static get connection() {
    return "pgMtn";
  }

  static get table() {
    return `${pgSchema}.vw_formulario`;
  }

  static castDates(field, value) {
    return value.format("DD/MM/YYYY HH:mm");
  }
}

module.exports = MtnQuestionarioView
