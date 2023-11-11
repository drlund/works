"use strict";

const Model = use("Model");

class Funci extends Model {
  static get table() {
    return 'DIPES_SAS.arhEstadoCivil';
  }

  static get primaryKey() {
    return "codigo";
  }

  static get connection() {
    return "dipesSas";
  }

  static get incrementing() {
    return false;
  }

  static get createdAtColumn() {
    return null;
  }

  static get updatedAtColumn() {
    return null;
  }

  // MUTATORS
  getDescricaoResumida(desc) {
    return desc || "Não Informado";
  }
}

module.exports = Funci;
