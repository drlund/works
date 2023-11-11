"use strict";

const _ = require('lodash');

const Database = use("Database");

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Analise = use("App/Models/Mysql/Designacao/Analise");

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Designacao = use("App/Models/Mysql/Designacao");

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Solicitacao = use("App/Models/Mysql/Designacao/Solicitacao");

const { TABELAS } = use('App/Commons/Designacao/Constants');

class AnalisesRepository {
  constructor() {
    this.novaAnalise = null;
    this.analise = null;
  }

  async post(analise, trx = null) {
    this.novaAnalise = new Analise();
    Object.assign(this.novaAnalise, analise);
    await this.novaAnalise.save(trx);

    return this.novaAnalise;
  }

  async set(id, campo, valor, trx = null) {
    this.analise = new Analise();
    await this.analise.find(id);
    this.analise[campo] = valor;
    await this.analise.save(trx);
    return this.analise;
  };

  async getOne(id) {
    this.analise = await Analise.find(id);
    return this.analise.toJSON();
  }

  async getAnalise(id) {
    return await Analise.find(id);
  }
}

module.exports = AnalisesRepository;
