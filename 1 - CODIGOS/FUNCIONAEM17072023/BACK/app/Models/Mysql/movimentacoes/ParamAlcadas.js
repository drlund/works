"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class ParamAlcadas extends Model {
  /**
   * @override
   */
  static get connection() {
    return "movimentacoes";
  }

  /**
   * @override
   */
  static get table() {
    return "competenciaNomeacao";
  }

  //indica os campos do tipo date

  /**
   * @override
   */
  static get dates() {
    return super.dates.concat(["dtAtualizacao"]);
  }

  //formato de saida das datas

  /**
   * @override
   * @param {{ format: (arg0: string) => any; }} value
   */
  static castDates(value) {
    return value.format("DD/MM/YYYY hh:mm:ss");
  }

  static get hidden() {
    return ["ativo"];
  }

  static get computed() {
    return ["isAtivo"];
  }

  getIsAtivo() {
    return this.ativo === "1";
  }
  /**
   * @override
   * @returns {Date}
   */
  static get createdAtColumn() {
    return null;
  }

  /**
   * @override
   * @returns {Date}
   */
  static get updatedAtColumn() {
    return null;
  }
}

module.exports = ParamAlcadas;
