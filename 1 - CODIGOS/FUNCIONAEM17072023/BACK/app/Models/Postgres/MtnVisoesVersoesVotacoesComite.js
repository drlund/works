"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");
const { mtnConsts } = use("Constants");
const { pgSchema } = mtnConsts;

class MtnVisoesVersoesVotacoesComite extends Model {
  static get connection() {
    return "pgMtn";
  }


  static get dates() {
    return super.dates.concat(["votado_em"]);
  }

  static castDates(field, value) {
    return value.format("DD/MM/YYYY HH:mm");
  }

  tipoVoto() {
    return this.hasOne(
      "App/Models/Postgres/MtnVisaoComiteTipoVoto",
      "tipo_voto_id",
      "id"
    );
  }

  anexos() {
    return this.belongsToMany(
      "App/Models/Postgres/MtnAnexo",
      "id_versao_votacoes_comite",
      "id_anexo",
      "id",
      "id"
    ).pivotTable(`${pgSchema}.visoes_versoes_votacoes_comite_anexos`);
  }

  static get table() {
    return `${pgSchema}.visoes_versoes_votacoes_comite`;
  }
}

module.exports = MtnVisoesVersoesVotacoesComite;
