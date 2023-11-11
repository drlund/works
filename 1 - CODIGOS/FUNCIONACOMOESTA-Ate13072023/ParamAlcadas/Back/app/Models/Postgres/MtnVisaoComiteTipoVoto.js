'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')
const {mtnConsts} = use("Constants");
const {pgSchema} = mtnConsts;

class MtnVisaoComiteTipoVoto extends Model {

  static get connection() {
    return "pgMtn";
  }

  static get table() {
    return `${pgSchema}.visoes_versoes_votacoes_tipo_voto`;
  }
}

module.exports = MtnVisaoComiteTipoVoto
