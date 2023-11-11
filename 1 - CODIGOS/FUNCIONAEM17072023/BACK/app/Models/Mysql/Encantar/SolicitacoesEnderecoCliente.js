"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class SolicitacoesEnderecoCliente extends Model {
  static get connection() {
    return "encantar";
  }

  static get table() {
    return "solicitacoesEnderecoCliente";
  }

  static get createdAtColumn() {
    return "createdAt";
  }

  solicitacao() {
    return this.belongsTo(
      "App/Models/Mysql/Encantar/Solicitacoes",
      "idSolicitacao",
      "id"
    );
  }

  static get updatedAtColumn() {
    return "updatedAt";
  }
}

module.exports = SolicitacoesEnderecoCliente;
