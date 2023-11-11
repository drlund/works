'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');
const moment = use("App/Commons/MomentZoneBR");
const baseMoment = require('moment-timezone');

class DadosAutoridadesSecex extends Model {
  static get connection() {
    return "appAniversariantes";
  }

  static get table(){
    return 'dados_autoridades_secex';
  }

  static get createdAtColumn () {
    return null
  }

  static get updatedAtColumn () {
    return null
  }

  //campos do tipo date
  static get dates() {
    return super.dates.concat(['data_atualizacao'])
  }

  //formato de saida das datas
  static castDates(field, value) {
    return value.format("DD/MM/YYYY HH:mm:ss")
  } 

  getAniversario(aniversario) {
    return baseMoment.utc(moment(aniversario, "YYYY-MM-DD")).format("DD/MM");
  }
}

module.exports = DadosAutoridadesSecex
