"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");
const { mtnConsts } = use("Constants");
const { pgSchema } = mtnConsts;
/** @type {typeof import('moment')} */
const moment = require("moment");

class MtnVisoesLinhaTempo extends Model {
  static get connection() {
    return "pgMtn";
  }

  static get table() {
    return `${pgSchema}.visoes_linha_tempo`;
  }
  getCreatedAt(created_at) {
    return moment(created_at).format("DD/MM/YYYY HH:mm");
  }
  getUpdatedAt(updated_at) {
    return moment(updated_at).format("DD/MM/YYYY HH:mm");
  }

}

module.exports = MtnVisoesLinhaTempo;
