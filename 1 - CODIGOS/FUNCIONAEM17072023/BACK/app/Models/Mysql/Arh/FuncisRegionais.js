"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class FuncisRegionais extends Model {
  static get table() {
    return "funcis_regionais";
  }

  static get connection() {
    return "superadm";
  }

  cargosComissoes () {
    return this.hasOne(
      "App/Models/Mysql/Arh/CargosComissoes",
      "comissao",
      "cd_funcao"
    );
  }

  static get createdAtColumn() {
    return null;
  }

  static get updatedAtColumn() {
    return null;
  }
}

module.exports = FuncisRegionais;
