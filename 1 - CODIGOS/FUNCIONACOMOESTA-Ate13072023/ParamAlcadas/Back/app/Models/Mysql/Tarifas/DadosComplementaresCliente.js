"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class DadosComplementaresCliente extends Model {
  static get connection() {
    return "tarifas";
  }

  static get table() {
    return "dadosComplementaresCliente";
  }

  dadosCliente() {
    return this.belongsTo("App/Models/Mysql/Tarifas/Ocorrencias", "mci", "mci");
  }

  static get createdAtColumn() {
    return null;
  }

  static get updatedAtColumn() {
    return null;
  }
}

module.exports = DadosComplementaresCliente;
