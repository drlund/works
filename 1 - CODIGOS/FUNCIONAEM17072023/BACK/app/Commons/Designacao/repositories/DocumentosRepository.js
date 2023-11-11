"use strict";

const _ = require('lodash');
const HistoricosRepository = require('./HistoricosRepository');
const fs = use("fs");
const md5 = use("md5");
const Helpers = use('Helpers');
const Database = use("Database");

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Analise = use("App/Models/Mysql/Designacao/Analise");

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Designacao = use("App/Models/Mysql/Designacao");

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Solicitacao = use("App/Models/Mysql/Designacao/Solicitacao");
const Documento = use('App/Models/Mysql/Designacao/Documento');

const { TABELAS } = use('App/Commons/Designacao/Constants');

class DocumentosRepository {
  constructor() {
    this.novoDocumento = null;
    this.documento = null;
    this.documentos = null;
    this.novoHistorico = null;
  }

  async post(parecer, arquivos, user, trx = null) {
    this.novoDocumento = new Documento();

    this.novoDocumento.id_solicitacao = parecer.id_solicitacao;
    if (parecer.id_negativa) this.novoDocumento.id_negativa = parecer.id_negativa;
    this.novoDocumento.id_historico = parecer.id_historico;
    this.novoDocumento.texto = parecer.texto || ' ';
    this.novoDocumento.funci_upload = user.chave;

    const documento = [];

    if (parecer.arquivos) {

      fs.mkdirSync(Helpers.appRoot(`uploads/Designacao/${parecer.id_solicitacao}`), { recursive: true })

      for (let arquivo of arquivos) {
        const nome = md5(arquivo.tmpPath);
        await arquivo.move(Helpers.appRoot(`uploads/Designacao/${parecer.id_solicitacao}/`), {
            name: nome,
            overwrite: true,
        });

        if (!arquivo.moved()) {
          return arquivo.error()
        }

        documento.push({ documento: nome, extensao: arquivo.extname });
      }

    }

    this.novoDocumento.documento = JSON.stringify(documento);

    await this.novoDocumento.save(trx);

    this.novoHistorico = new HistoricosRepository();
    await this.novoHistorico.post({
      ...parecer,
      id_documento: this.novoDocumento.id
    }, user, trx);

    return this.novoDocumento;
  }

  async set(id, campo, valor, trx = null) {
    this.analise = new Analise();
    await this.analise.find(id);
    this.analise[campo] = valor;
    await this.analise.save(trx);
    return this.documento;
  };

  async getOne(id, user) {

  }

  async getMany(consulta, user) {

  }

  async _getUserPrivileges(user) {

  }
}

module.exports = DocumentosRepository;
