"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");
const { mtnConsts } = use("Constants");
const { pgSchema } = mtnConsts;
/** @type {typeof import('moment')} */
const moment = use("moment");

class MtnEnvolvido extends Model {
  static get connection() {
    return "pgMtn";
  }

  static get table() {
    return `${pgSchema}.envolvidos`;
  }

  static get dates() {
    return super.dates.concat(["respondido_em", "versionado_em"]);
  }

  static castDates(field, value) {
    return value.format("DD/MM/YYYY HH:mm");
  }

  getCreatedAt(created_at) {
    return moment(created_at).format("DD/MM/YYYY HH:mm");
  }

  getRespondidoEm(respondido_em) {
    return respondido_em === null
      ? null
      : moment(respondido_em).format("DD/MM/YYYY HH:mm");
  }

  mtn() {
    return this.belongsTo("App/Models/Postgres/Mtn", "id_mtn", "id");
  }

  medida() {
    return this.belongsTo("App/Models/Postgres/MtnMedida", "id_medida", "id");
  }

  medidaSugerida() {
    return this.belongsTo(
      "App/Models/Postgres/MtnMedida",
      "id_medida_prevista",
      "id"
    );
  }

  esclarecimentos() {
    return this.hasMany(
      "App/Models/Postgres/MtnEsclarecimento",
      "id",
      "id_envolvido"
    );
  }

  alteracoesMedida() {
    return this.hasMany(
      "App/Models/Postgres/MtnAlterarMedida",
      "id",
      "id_envolvido"
    );
  }

  aprovacoesMedida(){
    return this.hasMany(
      "App/Models/Postgres/MtnAprovacoesMedida",
      "id",
      "id_envolvido"
    );

  }

  recursos() {
    return this.hasMany("App/Models/Postgres/MtnRecurso", "id", "id_envolvido");
  }

  anexos() {
    return this.hasMany(
      "App/Models/Postgres/MtnEnvolvidoAnexo",
      "id",
      "id_envolvido"
    );
  }

  timeline() {
    return this.hasMany(
      "App/Models/Postgres/MtnTimeline",
      "id",
      "id_envolvido"
    );
  }

  logs(){
    return this.hasMany(
      "App/Models/Postgres/MtnLogsEnvolvidos",
      "id",
      "id_envolvido"
    );
  }

  notificacoes() {
    return this.hasMany(
      "App/Models/Postgres/MtnNotificacacao",
      "id",
      "id_envolvido"
    );
  }

  notasInternas() {
    return this.hasMany(
      "App/Models/Postgres/MtnNotasInternas",
      "id",
      "id_envolvido"
    )
  }

  notasInternasLidas() {
    return this.hasMany(
      "App/Models/Postgres/MtnNotasInternasLeitura",
      "id",
      "id_envolvido"
    )
  }
}

module.exports = MtnEnvolvido;
