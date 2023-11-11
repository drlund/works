"use strict";

/**
 * @typedef {Object} Solicitacoao
 *
 * @property {number} id,
 * @property {string} idSolicitacoesStatus,
 *
 */

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class Solicitacoes extends Model {
  static get connection() {
    return "encantar";
  }

  static get table() {
    return "solicitacoes";
  }

  //campos do tipo date
  static get dates() {
    return super.dates.concat(["dataSolicitacao", "createdAt", "updatedAt"]);
  }

  //formato de saida das datas
  static castDates(field, value) {
    return value.format("DD/MM/YYYY HH:mm");
  }

  fluxoUtilizado() {
    return this.hasMany(
      "App/Models/Mysql/Encantar/SolicitacoesFluxoUtilizado",
      "id",
      "idSolicitacao"
    );
  }

  brindes() {
    return this.hasMany(
      "App/Models/Mysql/Encantar/SolicitacoesBrindes",
      "id",
      "idSolicitacao"
    );
  }

  reacoes() {
    return this.hasMany(
      "App/Models/Mysql/Encantar/SolicitacoesReacaoClientes",
      "id",
      "idSolicitacao"
    );
  }

  execucao() {
    return this.hasOne(
      "App/Models/Mysql/Encantar/Execucao",
      "id",
      "idSolicitacao"
    );
  }

  cancelamento() {
    return this.hasOne(
      "App/Models/Mysql/Encantar/SolicitacoesCancelamentos",
      "id",
      "idSolicitacao"
    );
  }

  falhaEntrega() {
    return this.hasOne(
      "App/Models/Mysql/Encantar/SolicitacoesFalhaEntrega",
      "id",
      "idSolicitacao"
    );
  }

  status() {
    return this.hasOne(
      "App/Models/Mysql/Encantar/Status",
      "id",
      "idSolicitacao"
    );
  }

  historico() {
    return this.hasMany(
      "App/Models/Mysql/Encantar/HistoricoSolicitacao",
      "id",
      "idSolicitacao"
    );
  }

  log() {
    return this.hasMany("App/Models/Mysql/Encantar/Log", "id", "idSolicitacao");
  }

  redesSociais() {
    return this.hasMany(
      "App/Models/Mysql/Encantar/RedesSociais",
      "id",
      "idSolicitacao"
    );
  }

  envio() {
    return this.hasOne(
      "App/Models/Mysql/Encantar/SolicitacoesEnvio",
      "id",
      "idSolicitacao"
    );
  }

  entregaCliente() {
    return this.hasMany(
      "App/Models/Mysql/Encantar/SolicitacoesEntregaCliente",
      "id",
      "idSolicitacao"
    );
  }

  enderecoCliente() {
    return this.hasOne(
      "App/Models/Mysql/Encantar/SolicitacoesEnderecoCliente",
      "id",
      "idSolicitacao"
    );
  }

  tratamentoDevolucao() {
    return this.hasOne(
      "App/Models/Mysql/Encantar/SolicitacoesTratamentoDevolucao",
      "id",
      "idSolicitacao"
    );
  }

  analise() {
    return this.hasOne(
      "App/Models/Mysql/Encantar/Analise",
      "id",
      "idSolicitacao"
    );
  }

  produtoBB() {
    return this.hasOne(
      "App/Models/Mysql/Encantar/ProdutosBB",
      "idProdutoBB",
      "id"
    );
  }

  status() {
    return this.belongsTo(
      "App/Models/Mysql/Encantar/SolicitacoesStatus",
      "idSolicitacoesStatus",
      "id"
    );
  }

  notificacoes() {
    return this.hasMany(
      "App/Models/Mysql/Encantar/Notificacoes",
      "id",
      "idSolicitacao"
    );
  }

  anexos() {
    return this.belongsToMany(
      "App/Models/Mysql/Encantar/Anexos",
      "idSolicitacao",
      "idAnexo",
      "id",
      "id"
    ).pivotTable("app_encantar.solicitacoesAnexos");
  }

  static get createdAtColumn() {
    return "createdAt";
  }

  static get updatedAtColumn() {
    return "updatedAt";
  }
}

module.exports = Solicitacoes;
