"use strict";

const { Command } = require("@adonisjs/ace");
/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const recursosModel = use("App/Models/Postgres/MtnRecurso");
const Database = use("Database");
const { getDiasTrabalhados } = use("App/Commons/DateUtils");
const Logger = use("Logger");
const getDataBasePrazo = use("App/Commons/Mtn/getDataBasePrazo");
const isAcoesNoVecimento = use("App/Commons/Mtn/isAcoesNoVecimento");
const notificarUltimoDia = use("App/Commons/Mtn/notificarUltimoDia");
const { mtnConsts } = use("Constants");
const { msgsRevelia, tiposNotificacao, acoes, prazosRevelia } = mtnConsts;
const insereTimeline = use("App/Commons/Mtn/insereTimeline");
const moment = require("moment");
const notificarEnvolvido = use("App/Commons/Mtn/notificarEnvolvido");
const logAusencias = use("App/Commons/Mtn/logAusencias");
/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const envolvidoModel = use("App/Models/Postgres/MtnEnvolvido");

const logRecurso = (idRecurso, dataBase, tipo, dataCriacao) => {
  Logger.transport("mtnPrazos").info("====================");
  Logger.transport("mtnPrazos").info(`Tipo: ${tipo} `);
  Logger.transport("mtnPrazos").info(`Id Recurso: ${idRecurso}`);
  Logger.transport("mtnPrazos").info(`Data base: ${dataBase}`);
  Logger.transport("mtnPrazos").info(`Criação Recurso: ${dataCriacao}`);
  Logger.transport("mtnPrazos").info(
    `Timestamp: ${moment().format("YYYY-MM-DD HH:mm:ss")}`
  );
  Logger.transport("mtnPrazos").info("====================");
};

class AtualizarPrazosRecurso extends Command {
  static get signature() {
    return "mtn:atualizaPrazosRecursos";
  }

  static get description() {
    return "Calcula os prazos de recursos MTN e atualiza os campos necessários";
  }

  async handle(args, options) {
    const prazoVencimento = prazosRevelia.RECURSO;
    //Recupera todos os esclarecimentos pendentes

    const recursos = await recursosModel
      .query()
      .whereNull("revelia_em")
      .whereNull("respondido_em")
      .with("envolvido")
      .fetch();

    let cont = 0;
    let notificacaoRevelia = null;
    for (let recurso of recursos.rows) {
      notificacaoRevelia = null;
      cont++;
      this.info(`${cont} / ${recursos.rows.length}`);
      const data = await getDataBasePrazo(recurso.created_at, "RECURSOS");
      const { matricula, id } = recurso.toJSON().envolvido;

      const trx = await Database.connection("pgMtn").beginTransaction();

      let qtdDiasTrabalhados = await getDiasTrabalhados(
        matricula,
        data,
        moment().format("YYYY-MM-DD"),
        { func: logAusencias, trx }
      );

      const acoesNoVencimento = await isAcoesNoVecimento();

      //GAMBIARRA ALERT
      // O recurso abaixo deve ser incrementado por ter incluido ausência posteriormente
      //POSTERIORMENTE IMPLEMENTAR ESSA LÓGICA DE UMA MANEIRA DECENTE
      if (recurso.id === 145) {
        qtdDiasTrabalhados = qtdDiasTrabalhados - 4;
        if (qtdDiasTrabalhados < 0) {
          qtdDiasTrabalhados = 0;
        }
      }

      try {
        //Caso seja o último dia de prazo, acionar a notificação
        if (acoesNoVencimento && qtdDiasTrabalhados === prazoVencimento) {
          await notificarUltimoDia(
            recurso.toJSON().envolvido.id,
            tiposNotificacao.PRAZO_RECURSO.id,
            trx
          );
        }

        if (acoesNoVencimento && qtdDiasTrabalhados > prazoVencimento) {
          recurso.txt_recurso = msgsRevelia.finalizado;
          recurso.revelia_em = moment();

          notificacaoRevelia = await insereTimeline(
            recurso.id_envolvido,
            acoes.REVELIA_RECURSO,
            null,
            tiposNotificacao.REVELIA_RECURSO,
            true,
            trx
          );

          const envolvido = await envolvidoModel.find(recurso.id_envolvido);
          envolvido.pendente_recurso = false;
          await envolvido.save(trx);

          logRecurso(
            recurso.id,
            data,
            "Recurso - Vencimento",
            recurso.created_at
          );
        }

        recurso.qtd_dias_trabalhados = qtdDiasTrabalhados;
        await recurso.save(trx);
        await trx.commit();

        if (notificacaoRevelia) {
          await notificarEnvolvido(
            notificacaoRevelia.tipoNotificacao,
            notificacaoRevelia.idEnvolvido,
            notificacaoRevelia.acao,
            notificacaoRevelia.idNotificacao,
            false
          );
        }
      } catch (error) {
        await trx.rollback();
        logRecurso(
          recurso.id,
          data,
          "Recurso - Erro no cálculo do prazo - " + erro,
          recurso.created_at
        );
      }
    }
    Database.close();
    process.exit();
  }
}

module.exports = AtualizarPrazosRecurso;
