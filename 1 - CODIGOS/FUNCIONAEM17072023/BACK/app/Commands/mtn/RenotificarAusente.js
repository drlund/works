"use strict";

const { Command } = require("@adonisjs/ace");
const { getUltimoDiaUtil, isFunciAusente } = use("App/Commons/DateUtils");

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const notificacaoModel = use("App/Models/Postgres/MtnNotificacao");

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const envolvidoModel = use("App/Models/Postgres/MtnEnvolvido");

const TemplateEmailEngine = use("App/Commons/TemplateEmailEngine");
const Database = use("Database");
const Logger = use("Logger");
const getDadosFunci = use("App/Commons/Mtn/getDadosFunci");
const { mtnConsts } = use("Constants");
const { tiposNotificacao, medidas, tituloEmail } = mtnConsts;
const isAcoesNoVecimento = use("App/Commons/Mtn/isAcoesNoVecimento");

/** @type {typeof import('moment')} */
const moment = use("App/Commons/MomentZone");

const renotificarFuncionario = async (notificacao) => {
  const envolvido = await envolvidoModel.find(
    notificacao.toJSON().envolvido.id
  );
  await envolvido.load("mtn");

  const tipoNotificacao = tiposNotificacao[notificacao.tipo];

  //Quando a medida for alerta ético e já for a finalização do parecer, deve-se enviar com aviso de recebimento
  const avisoRecebimento =
    envolvido.id_medida === medidas.ALERTA_ETICO_NEGOCIAL &&
    acao.id === acoes.FINALIZAR_ANALISE;

  const dadosFunci = await getDadosFunci(envolvido.matricula);

  const emailEngine = new TemplateEmailEngine(tipoNotificacao.template, {
    from: avisoRecebimento
      ? "mtn.alertaetico@bb.com.br"
      : "mtn.naoresponder@bb.com.br",
    subject: tituloEmail + " (REENVIO)",
    confirmReading: avisoRecebimento,
  });

  let enviou = await emailEngine.sendMail(
    {
      confirmReading: avisoRecebimento,
      to: dadosFunci.email.trim().toLowerCase(),
    },

    [envolvido.id_mtn, envolvido.toJSON().mtn.nr_mtn]
  );

  notificacao.renotificado = true;
  notificacao.reenviar = false;

  await notificacao.save();
};

const marcarRenotificacao = async (notificacao) => {
  notificacao.reenviar = true;
  notificacao.renotificado = false;
  await notificacao.save();
};

/**
 *  Comando que será executado todos os dias para verificar se um usuário deverá ser renotificado seguindo as seguintes regras:
 *
 *
 *    1 - Recupera todos as notificações enviadas no último dia de semana (segunda a sexta)
 *    2 - Verifica se algum dos funcionários notificados estava ausente naquele dia
 *    3-  Caso o usuário estivesse ausente na data anterior e não esteja na data de hoje ele será renotificado
 *    4 - Incluir um marcador na renotificação indentificando-a como tal
 *
 *
 */

class RenotificarAusente extends Command {
  static get signature() {
    return "mtn:renotificarAusente";
  }

  static get description() {
    return "Renotifica os funcionários que foram notificados durante uma ausência";
  }

  async handle(args, options) {
    //Caso as ações no vencimento esteja desativadas, não devem haver notificações
    const acoesNoVencimento = await isAcoesNoVecimento();
    if (!acoesNoVencimento) {
      Database.close();
      process.exit();
      return;
    }

    //Recuperar ultimo dia útil
    const ultimoDiaUtil = await getUltimoDiaUtil();

    //Recuperar todas as notificações deste último dia util
    const notificacoes = await notificacaoModel
      .query()
      .where((builder) => {
        builder.where("created_at", ">=", ultimoDiaUtil.format("YYYY-MM-DD"));
        builder.where(
          "created_at",
          "<=",
          ultimoDiaUtil.clone().add(1, "day").format("YYYY-MM-DD")
        );
      })
      .where((builder) => {
        builder.where("reenviar", true);
        builder.where("renotificado", false);
      })
      .with("envolvido")
      .fetch();

    //Verifica, para cada uma delas, se algum dos funcionários estava ausente
    for (let notificacao of notificacoes.rows) {

      const dadosLogger = {
        tipo: "RENOTIFICACAO",
        notificacao,
        timestamp: moment().format(),
      };

      const ausenteUltimoDiaUtil = await isFunciAusente(
        ultimoDiaUtil,
        notificacao.toJSON().envolvido.matricula
      );

      const ausenteHoje = await isFunciAusente(
        moment(),
        notificacao.toJSON().envolvido.matricula
      );

      //Caso o funcionário esteja presente hoje e estava ausente no último dia útil renotificar
      if (!ausenteHoje && ausenteUltimoDiaUtil) {
        await renotificarFuncionario(notificacao);
        dadosLogger.tipoRenotificacao =
          "RENOTIFICAR: Usuário ausente hoje e também no último dia últil";
        Logger.transport("mtnRenotificacoes").info({
          ...dadosLogger,
        });
      }

      //Caso o funcionário ainda esteja ausente, inserir na tabela de renotificações
      if (ausenteHoje && ausenteUltimoDiaUtil) {
        await marcarRenotificacao(notificacao);
        dadosLogger.tipoRenotificacao =
          "MARCAR_PARA_RENOTIFICACAO: Usuário inserida na última tabela de renotificação";
        Logger.transport("mtnRenotificacoes").info({
          ...dadosLogger,
        });
      }
    }

    Database.close();
    process.exit();
  }
}

module.exports = RenotificarAusente;
