'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');
const moment = use("App/Commons/MomentZoneBR");
const baseMoment = require('moment-timezone');

class DadosCongresso extends Model {
  static get connection() {
    return "appAniversariantes";
  }

  static get table(){
    return 'dados_autoridades';
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

  getDataNascimento(dataNascimento) {
    return baseMoment.utc(moment(dataNascimento, "YYYY-MM-DD")).format("DD/MM");
  }

}

module.exports = DadosCongresso
