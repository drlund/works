"use strict";
/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */

const Evento = use("App/Models/Mysql/Ambiencia/Evento");
const moment = require("moment");
const constants = use("App/Commons/Ambiencia/Constants");
const hoje = moment().format("YYYY-MM-DD");

class CampanhasRepository {
  async getCampanhas(vigente = constants.TODOS) {
    let campanhas;
    let queryCampanhas = Evento.query();
    switch (vigente) {
      case constants.VIGENTES:
        campanhas = await queryCampanhas
          .where("ativo", "S")
          .where(function () {
            this.where("dataInicioAvaliacao", ">=", hoje).orWhere(
              "dataEncerramentoAvaliacao",
              "<=",
              hoje
            );
          })
          .fetch();
        break;
      case constants.ENCERRADOS:
        campanhas = await queryCampanhas
          .where("ativo", "N")
          .where("dataEncerramentoAvaliacao", "<", hoje)
          .fetch();
        break;
      default:
        campanhas = await Evento.all();
        break;
    }
    return campanhas ? campanhas.toJSON() : campanhas;
  }
}

module.exports = CampanhasRepository;
