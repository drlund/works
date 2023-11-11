"use strict";

const _ = require('lodash');

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */

const Designacao = use("App/Models/Mysql/Designacao");

const {TABELAS} = use('App/Commons/Designacao/Constants');

class TiposRepository {
  async getAll() {
    let tipos = await Designacao.query()
      .from('tipos')
      .where('valido', 1)
      .fetch();

    return tipos.toJSON();
  }
}

module.exports = TiposRepository;