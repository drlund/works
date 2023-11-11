"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */

const TipoHistorico = use("App/Models/Mysql/Designacao/TipoHistorico");

class TiposHistoricosRepository {
  async getAll() {
    const tiposHistorico = await TipoHistorico.all();

    return tiposHistorico.toJSON();
  }
}

module.exports = TiposHistoricosRepository;