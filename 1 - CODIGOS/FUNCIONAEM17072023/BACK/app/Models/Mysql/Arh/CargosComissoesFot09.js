"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class CargoComissaoFot09 extends Model {
  /**
   * @override
   */
  static get table() {
    return "arhfot09";
  }

  /**
   * @override
   */
  static get connection() {
    return "dipes";
  }

  /**
   * @override
   * @returns {any}
   */
  static get createdAtColumn() {
    return null;
  }

  /**
   * @override
   * @returns {any}
   */
  static get updatedAtColumn() {
    return null;
  }
}

module.exports = CargoComissaoFot09;
