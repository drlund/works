"use strict";

const _ = require('lodash');

const Database = use("Database");

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Historico = use("App/Models/Mysql/Designacao/Historico");

const { TABELAS } = use('App/Commons/Designacao/Constants');

class HistoricosRepository {
  constructor() {
    this.novoHistorico = null;
    this.historico = null;
    this.historicos = null;
  }

  async post(parecer, user, trx = null) {
    this.novoHistorico = new Historico();

    this.novoHistorico.matricula = user.chave;
    this.novoHistorico.nome = user.nome_usuario.toUpperCase();
    this.novoHistorico.funcao = user.cod_funcao;
    this.novoHistorico.nome_funcao = user.nome_funcao;
    this.novoHistorico.prefixo = user.prefixo;
    this.novoHistorico.nome_prefixo = user.dependencia;
    this.novoHistorico.id_solicitacao = parecer.id_solicitacao;
    this.novoHistorico.id_historico = parecer.id_historico;

    parecer.tipo && (this.novoHistorico.tipo = parecer.tipo);
    parecer.id_documento && (this.novoHistorico.id_documento = parecer.id_documento);

    await this.novoHistorico.save(trx);

    return this;
  }

  async set(id, campo, valor, trx = null) {
    await this.novoHistorico.save(trx);
    return this;
  };

  async getOne(id, user) {

  }

  async getMany(consulta, user) {
    let solicitacao = await Solicitacao.query()
      .where("id", parseInt(id))
      .with("prefixo_dest")
      .with("prefixo_orig")
      .with("analise")
      .first();

    solicitacao = solicitacao.toJSON();

    let perfFunci = await getPerfilFunci(user, id);
    let perfil = await getPerfilFunciSolicitacao(perfFunci.user, solicitacao, perfFunci.funciLogado, perfFunci.comiteAdm, perfFunci.dadosComissaoFunciLogado, perfFunci.funciIsAdmin);

    let historico = await Historico.query()
      .where('id_solicitacao', id)
      .with('tipoHistorico')
      .with('documento')
      .orderBy('id', 'desc')
      .fetch();

    historico = historico.toJSON();
  }

  async _getUserPrivileges(user) {

  }
}

module.exports = HistoricosRepository;
