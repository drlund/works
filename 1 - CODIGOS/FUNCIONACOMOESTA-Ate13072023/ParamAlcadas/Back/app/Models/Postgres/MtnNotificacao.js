"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");
const { mtnConsts } = use("Constants");
const { pgSchema } = mtnConsts;


class MtnNotificacao extends Model {

    static get connection() {
        return "pgMtn";
      }
    
      static castDates(field, value) {
        return value.format("DD/MM/YYYY HH:mm");
      }
      static get table() {
        return `${pgSchema}.notificacoes`;
      }

      envolvido() {
        return this.belongsTo(
          "App/Models/Postgres/MtnEnvolvido",
          "id_envolvido",
          "id"
        );
      }
}

module.exports = MtnNotificacao
