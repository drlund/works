"use strict";

const { Command } = require("@adonisjs/ace");
const _ = require("lodash");
const setConcluir = use("App/Commons/Designacao/setConcluir");

const Database = use("Database");
const Logger = use("Logger");

const Solicitacao = use("App/Models/Mysql/Designacao/Solicitacao");
const MailLog = use("App/Models/Mysql/Designacao/MailLog");

/** @type {typeof import('moment')} */
const moment = use("App/Commons/MomentZone");

const enviarEmailCobranca = use("App/Commons/Designacao/enviarEmailCobranca");
const setDocumento = use("App/Commons/Designacao/setDocumento");
const { getOneDependencia } = use("App/Commons/Arh");
const { sendMail } = use("App/Commons/SendMail");
const { replaceVariable } = use("App/Commons/StringUtils");
const Env = use("Env");
const FRONTEND_URL = Env.get("FRONTEND_URL");
const getMainEmail = use("App/Commons/Designacao/getMainEmail");

class EnviarEmailDeAcordo extends Command {
  static get signature() {
    return "desigint:enviarEmailDeAcordo";
  }

  static get description() {
    return "Envia email de Cobrança De Acordo Pendente";
  }

  async handle(args, options) {
    // recupera as solicitações com assinatura do De Acordo PENDENTES
    let solicitacoes = await Solicitacao.query()
      .with("analise")
      .with("prefixo_orig")
      .with("prefixo_dest")
      .where("id_situacao", 1)
      .orderBy("id")
      .fetch();

    if (!solicitacoes) {
      Database.close();
      process.exit();
      return;
    }

    solicitacoes = solicitacoes.toJSON();

    const aCancelar = solicitacoes.filter((solicitacao) => {
      return moment(solicitacao.dt_ini).isBefore(moment(), "day");
    });

    let aCobrar = solicitacoes.filter((solicitacao) => {
      return moment(solicitacao.dt_ini).isSameOrAfter(moment(), "day");
    });

    const user = {
      chave: "F0000000",
      nome_usuario: "Robô SuperADM",
      cod_funcao: "99999",
      nome_funcao: "Agente de Cobrança",
      prefixo: 9009,
      dependencia: "SuperADM",
    };

    const arquivos = null;

    for (let solicitacao of aCancelar) {
      await setConcluir(
        {
          id_solicitacao: solicitacao.id,
          id_historico: '28',
          texto:
            "Solicitação cancelada por falta de manifestação De Acordo antes da data de início registrada!",
          id_negativa: null,
          tipo: null,
        },
        arquivos,
        user
      );
    }

    aCobrar = aCobrar.map((elem) => {
      let prefixosPendentes = [];

      elem.situacaoOrigem = !!elem.analise.parecer_origem;
      elem.situacaoDestino = !!elem.analise.parecer_destino;

      if (
        elem.analise.gg_ou_super ||
        elem.analise.deacordo_super_destino ||
        elem.limitrofes
      ) {
        elem.situacaoSuperior = !!elem.analise.parecer_super_destino;
        if (!_.isNil(elem.prefixo_dest.gerev)) {
          prefixosPendentes.push(elem.prefixo_dest.gerev);
        }
        if (!_.isNil(elem.prefixo_dest.super)) {
          prefixosPendentes.push(elem.prefixo_dest.super);
        }
      } else if (elem.super) {
        elem.situacaoSuperior = !!elem.analise.parecer_diretoria;
        if (!_.isNil(elem.prefixo_dest.diretoria)) {
          prefixosPendentes.push(elem.prefixo_dest.diretoria);
        }
      }

      if (!elem.situacaoOrigem) {
        if (elem.paaOrig) {
          prefixosPendentes.push(elem.madrinhaOrig.prefixo);
        } else {
          prefixosPendentes.push(elem.pref_orig);
        }
      }

      if (!elem.situacaoDestino) {
        if (elem.paaDest) {
          prefixosPendentes.push(elem.madrinhaDest.prefixo);
        } else {
          prefixosPendentes.push(elem.pref_dest);
        }
      }

      elem.prefixosPendentes = prefixosPendentes;

      return elem;
    });

    await enviarEmailCobranca(aCobrar, user);

    Database.close();
    process.exit();
  }
}

module.exports = EnviarEmailDeAcordo;
