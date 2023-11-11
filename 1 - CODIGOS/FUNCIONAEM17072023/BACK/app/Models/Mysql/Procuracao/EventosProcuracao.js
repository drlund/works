"use strict";

const Model = use("Model");

class EventosProcuracao extends Model {
  static get connection() {
    return "procuracao";
  }

  static get table() {
    return "eventosProcuracao";
  }

  procuracao() {
    return this.belongsTo(
      "App/Models/Mysql/Procuracao/Procuracao",
      "idProcuracao",
      "id"
    );
  }

  static get createdAtColumn() {
    return "createdAt";
  }

  static get updatedAtColumn() {
    return "updatedAt";
  }
}

module.exports = EventosProcuracao;
