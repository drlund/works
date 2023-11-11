"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

// @ts-ignore
class ConfereComite extends Model {
  // faz a conexão com o database
  /**
   * @override
   */
  static get connection() {
    return "movimentacoes";
  }

  // indica qual tabela usar
  /**
   * @override
   */
  static get table() {
    return "comite_membros";
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

  // coluna de criação do dado
  /**
   * @override
   * @returns {any}
   */
  static get createdAtColumn() {
    return null;
  }

  // coluna de atualização do dado
  /**
   * @override
   * @returns {any}
   */
  static get updatedAtColumn() {
    return null;
  }
}

module.exports = ConfereComite;