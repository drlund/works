"use strict";

const _ = require('lodash');

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */

const Designacao = use("App/Models/Mysql/Designacao");

const {TABELAS} = use('App/Commons/Designacao/Constants');

class PrefixosTesteRepository {
  async getSupersTeste() {
    const querySupers = await Designacao.query()
      .from(TABELAS.PREFIXOS_TESTE)
      .fetch();

    return querySupers.toJSON();
  }
}

module.exports = PrefixosTesteRepository;