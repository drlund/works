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
const Constants = use("App/Commons/Designacao/Constants");

class CancelarDeAcordoVencido extends Command {
  static get signature() {
    return "desigint:cancelarDeAcordoVencido";
  }

  static get description() {
    return "Cancela Solicitações com o De Acordo Pendente e data de início anterior à data atual, sem enviar aviso/e-mail";
  }

  async handle(args, options) {
    // recupera as solicitações com assinatura do De Acordo PENDENTES
    let solicitacoes = await Solicitacao.query()
      .with("analise")
      .with("prefixo_orig")
      .with("prefixo_dest")
      .whereNotIn("id_situacao", [Constants.SITUACOES.CONCLUIDO, Constants.SITUACOES.CANCELADO])
      .where("dt_fim", '<', moment().startOf('day').format(Constants.DATABASE_DATETIME_INPUT))
      .orderBy("id")
      .fetch();

    if (!solicitacoes) {
      Database.close();
      process.exit();
      return;
    }

    solicitacoes = solicitacoes.toJSON();

    const listaSolicitacoes = solicitacoes.map(solicitacao => solicitacao.protocolo);
    let textoSolicitacoes;

    if (listaSolicitacoes.length > 1) {
      const ultimo = listaSolicitacoes.pop();
      textoSolicitacoes = listaSolicitacoes.toString().replace(/,/g, ', ').concat(` e "${ultimo}"`);
    } else {
      textoSolicitacoes = listaSolicitacoes.toString();
    }

    console.log(`Os protocolos [${textoSolicitacoes}] serão marcados como CANCELADOS`);

    const user = {
      chave: "F0000000",
      nome_usuario: "Robô SuperADM",
      cod_funcao: "99999",
      nome_funcao: "Agente de Cobrança",
      prefixo: 9009,
      dependencia: "SuperADM",
    };

    const arquivos = null;

    for (let solicitacao of solicitacoes) {
      console.log(`CANCELANDO a solicitacao ${solicitacao.protocolo}.`);
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
      console.log(`Solicitacao ${solicitacao.protocolo} CANCELADA com sucesso`);
    }

    Database.close();
    process.exit();
  }
}

module.exports = CancelarDeAcordoVencido;
