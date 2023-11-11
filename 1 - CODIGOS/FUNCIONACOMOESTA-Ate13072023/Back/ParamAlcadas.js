"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
// @ts-ignore
const Model = use("Model");

// @ts-ignore
class ParamAlcadas extends Model {

  // @ts-ignore
  static get connection() {
    return "movimentacoes";
  }

  // @ts-ignore
  static get table() {
    return "competenciaNomeacao";
  }

  //indica os campos do tipo date
  // @ts-ignore
  static get dates() {
    return super.dates.concat(["dtAtualizacao"]);
  }

  //formato de saida das datas
  // @ts-ignore
  static castDates(field, value) {
    return value.format("DD/MM/YYYY hh:mm:ss");
  }

  // @ts-ignore
  static get createdAtColumn() {
    return null;
  }

  // @ts-ignore
  static get updatedAtColumn() {
    return null;
  }
}

module.exports = ParamAlcadas;