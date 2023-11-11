"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

const { mtnConsts } = use("Constants");
const { pgSchema } = mtnConsts;

class MtnQuestionarioNotificacao extends Model {
  static get connection() {
    return "pgMtn";
  }

  static get table() {
    return "app_formularios.tb_notificacoes";
  }

  static castDates(field, value) {
    return value.format("DD/MM/YYYY HH:mm");
  }
}

module.exports = MtnQuestionarioNotificacao;
