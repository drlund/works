"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");
const { mtnConsts } = use("Constants");
const { pgSchema } = mtnConsts;

class VwMtnPendentesSuper extends Model {
  static get connection() {
    return "pgMtn";
  }

  static get primaryKey () {
    return null;
  }

  static get table() {
    return `${pgSchema}.vw_mtn_pendentes_super`;
  }

}

module.exports = VwMtnPendentesSuper;
