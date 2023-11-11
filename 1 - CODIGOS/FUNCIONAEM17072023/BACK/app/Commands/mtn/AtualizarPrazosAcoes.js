"use strict";

const { Command } = require("@adonisjs/ace");
/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const mtnModel = use("App/Models/Postgres/Mtn");

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const timelineModel = use("App/Models/Postgres/MtnTimeline");
const getPrazoDesdeUltimaAcao = use("App/Commons/Mtn/getPrazoDesdeUltimaAcao");
const atualizaPendenciaAnalise = use(
  "App/Commons/Mtn/atualizaPendenciaAnalise"
);
const Logger = use("Logger");
const { getDiasTrabalhadosPrefixo } = use("App/Commons/DateUtils");
const moment = require("moment");
const Database = use("Database");
/** @type {typeof import('../../Commons/Constants')} */
const { mtnConsts } = use("Constants");
const { mtnStatus, acoes } = mtnConsts;

/**
 *
 *   A coluna prazo prazo_pendencia_analise, da tabela
 *   Além disso, atualiza na tabela envolvidos a última ação executada.
 *
 */
class AtualizarPrazosTimeline extends Command {
  static get signature() {
    return `mtn:AtualizarPrazosAcoes 
    { --all : Todos os mtns serão atualizados}
    {--log : Loga os mtns na tela }`;
  }

  static get description() {
    return "Atualiza a o prazo desde a última ação de cada um dos envolvidos. ";
  }

  async handle(args, options) {
    
    Logger.transport("mtnPrazos").info({
      tipo: "ACOES",
      msg: "Início da rotina de ações",
      timestamp: moment().format(),
    });
    return;
    const query = mtnModel.query();
    if (!options.all) {
      query
        .whereIn("id_status", [mtnStatus.A_ANALISAR, mtnStatus.EM_ANALISE])
    }
    const mtns = await query.fetch();

    var cont = 0;

    for (let mtn of mtns.rows) {
      this.info(mtn.id);
      await mtn.load("envolvidos");

      cont++;
      this.info(`Atualizando ${cont}/${mtns.rows.length}`);

      //Caso no qual não existem envolvidos na ocorrência
      if (mtn.toJSON().envolvidos.length === 0) {
        const qtdDiasTrabalhados = await getDiasTrabalhadosPrefixo(
          "9009",
          moment(mtn.created_at)
        );

        mtn.prazo_pendencia_analise = qtdDiasTrabalhados;
        await mtn.save();

        //Caso no qual existem envolvidos na ocorrência
      } else {
        for (let envolvido of mtn.toJSON().envolvidos) {
          this.info(envolvido.id);
          let ultimaTimelineEntry = await timelineModel
            .query()
            .where("id_envolvido", envolvido.id)
            .orderBy("id", "desc")
            .first();

          if (!ultimaTimelineEntry) {
            Logger.transport("timelineVazia").info({
              msg: `Envolvido ${envolvido.id} com timeline vazia. Incluída a criação`,
              timestamp: moment(),
            });
            if (options.log) {
              this.info(`Criada ação para ${envolvido.id}`);
            }

            ultimaTimelineEntry = await timelineModel
              .query()
              .where("id_envolvido", envolvido.id)
              .orderBy("id", "desc")
              .first();

            continue;
          }

          const diasDesdeUltimaAcao = await getPrazoDesdeUltimaAcao(
            envolvido.id
          );

          ultimaTimelineEntry.prazo_desde_ultima_acao = diasDesdeUltimaAcao;
          await ultimaTimelineEntry.save();
          await ultimaTimelineEntry.load("acao");

          const {
            instancia,
            acumula_prazo,
          } = ultimaTimelineEntry.toJSON().acao;
          if (!acumula_prazo) {
            await atualizaPendenciaAnalise(
              instancia,
              diasDesdeUltimaAcao,
              envolvido.id
            );
          }
        }
      }
    }
    Database.close();
    Logger.transport("mtnPrazos").info({
      tipo: "ACOES",
      msg: "Fim da rotina de atualizar ações",
      timestamp: moment().format(),
    });
    process.exit();
  }
}

module.exports = AtualizarPrazosTimeline;
