"use strict";

const _ = require('lodash');

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Designacao = use("App/Models/Mysql/Designacao");

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Superadm = use("App/Models/Mysql/Superadm");

const { TABELAS } = use('App/Commons/Designacao/Constants');

class OptsBasicasRepository {
  async getOptsBasicas(filtros) {
    const { funcao } = filtros;

    const [
      queryRefOrg,
      queryOpcoes
    ] = await Promise.all([
      await Superadm.query()
        .table("cargos_e_comissoes")
        .where("cod_funcao", funcao)
        .first(),
      await Designacao.query()
        .table("opts_basicas")
        .fetch()
    ]);

    return { refOrg: queryRefOrg.toJSON(), opcoes: queryOpcoes.toJSON() };
  }
}

module.exports = OptsBasicasRepository;