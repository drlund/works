"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");
const { EncantarConsts } = use("Constants");
const { CAMINHO_MODELS } = EncantarConsts;

class BrindesEstoquePermissao extends Model {
  static get connection() {
    return "encantar";
  }

  static get table() {
    return "brindesEstoquePermissao";
  }

  //campos do tipo date
  static get dates() {
    return super.dates.concat(["createdAt", "updatedAt"]);
  }

  //formato de saida das datas
  static castDates(field, value) {
    return value.format("DD/MM/YYYY hh:mm");
  }

  estoques() {
    return this.hasMany(
      `${CAMINHO_MODELS}/BrindesEstoque`,
      "prefixo",
      "prefixo"
    );
  }

  static get createdAtColumn() {
    return "createdAt";
  }

  static get updatedAtColumn() {
    return "updatedAt";
  }
}

module.exports = BrindesEstoquePermissao;
