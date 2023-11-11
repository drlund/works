"use strict";

const { Command } = require("@adonisjs/ace");
/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const esclarecimentoModel = use("App/Models/Postgres/MtnEsclarecimento");

const Logger = use("Logger");
/** @type {typeof import('moment')} */
const moment = require("moment");
const { getDiasTrabalhados } = use("App/Commons/DateUtils");
const notificarUltimoDia = use("App/Commons/Mtn/notificarUltimoDia");
const { mtnConsts } = use("Constants");
const { prazosRevelia } = mtnConsts;
const { msgsRevelia, tiposNotificacao, acoes } = mtnConsts;
const insereTimeline = use("App/Commons/Mtn/insereTimeline");
const getDataBasePrazo = use("App/Commons/Mtn/getDataBasePrazo");
const notificarEnvolvido = use("App/Commons/Mtn/notificarEnvolvido");
const isAcoesNoVecimento = use("App/Commons/Mtn/isAcoesNoVecimento");
const Database = use("Database");
const logAusencias = use("App/Commons/Mtn/logAusencias");

const logEsclarecimento = (
  idEnvolvido,
  dataBase,
  dataCriacaoEsclarecimento,
  tipo
) => {
  Logger.transport("mtnPrazos").info("====================");
  Logger.transport("mtnPrazos").info(`Tipo: ${tipo} `);
  Logger.transport("mtnPrazos").info(`Id Envolvido: ${idEnvolvido}`);
  Logger.transport("mtnPrazos").info(`Data base: ${dataBase}`);
  Logger.transport("mtnPrazos").info(
    `Criação Esclarecimento: ${dataCriacaoEsclarecimento}`
  );
  Logger.transport("mtnPrazos").info(
    `Timestamp: ${moment().format("YYYY-MM-DD HH:mm:ss")}`
  );
  Logger.transport("mtnPrazos").info("====================");
};
class AtualizaPrazosEsclarecimento extends Command {
  static get signature() {
    return "mtn:atualizaPrazosEsclarecimentos";
  }

  static get description() {
    return "Fecha à revelia solicitações de esclarecimento cujo prazo está vencido";
  }

  async handle(args, options) {
    const prazoTotal = prazosRevelia.ESCLARECIMENTO_PRORROGADO; // Prazo total, contando os dias já prorrogados
    const prazoInicial = prazosRevelia.ESCLARECIMENTO; // Prazo sem a prorrogação.

    const isVencido = (esclarecimento, qtdDiasTrabalhados) => {
      return (
        (qtdDiasTrabalhados > prazoInicial && !esclarecimento.prorrogado) || // Passou prazo inicial e não foi prorrogado
        (qtdDiasTrabalhados > prazoTotal && esclarecimento.prorrogado) // Foi prorrogado e passou do prazo total
      );
    };

    const isUltimoDia = (esclarecimento, qtdDiasTrabalhados) => {
      const prazoComparacao = esclarecimento.prorrogado
        ? prazoTotal
        : prazoInicial;
      return qtdDiasTrabalhados === prazoComparacao;
    };

    //Recupera todos os esclarecimentos pendentes
    const esclarecimentos = await esclarecimentoModel
      .query()
      .whereNull("revelia_em")
      .whereNull("respondido_em")
      .with("envolvido")
      .fetch();

    const acoesNoVencimento = await isAcoesNoVecimento();

    let cont = 0;
    let notificacaoRevelia = null;
    for (let esclarecimento of esclarecimentos.rows) {
      notificacaoRevelia = null;
      cont++;
      this.info(`ID: ${esclarecimento.id}`);
      this.info(`${cont} / ${esclarecimentos.rows.length}`);
      const data = await getDataBasePrazo(
        esclarecimento.created_at,
        "ESCLARECIMENTO"
      );

      const envolvido = esclarecimento.toJSON().envolvido;
      if (!envolvido) {
        continue;
      }
      const trx = await Database.connection("pgMtn").beginTransaction();

      let qtdDiasTrabalhados = await getDiasTrabalhados(
        esclarecimento.toJSON().envolvido.matricula,
        data,
        moment().format("YYYY-MM-DD"),
        { func: logAusencias, trx }
      );

      try {
        //Caso seja o último dia de prazo, acionar a notificação
        if (
          acoesNoVencimento &&
          isUltimoDia(esclarecimento, qtdDiasTrabalhados)
        ) {
          logEsclarecimento(
            esclarecimento.toJSON().envolvido.id,
            data,
            esclarecimento.created_at,
            "ESCLARECIMENTO - Ultimo dia"
          );

          await notificarUltimoDia(
            esclarecimento.toJSON().envolvido.id,
            tiposNotificacao.PRAZO_ESCLARECIMENTO.id,
            trx
          );
        }

        //Caso onde está vencido
        if (
          acoesNoVencimento &&
          isVencido(esclarecimento, qtdDiasTrabalhados)
        ) {
          esclarecimento.txt_resposta = msgsRevelia.finalizado;
          esclarecimento.revelia_em = moment();

          notificacaoRevelia = await insereTimeline(
            envolvido.id,
            acoes.REVELIA_ESCLARECIMENTO,
            null,
            tiposNotificacao.REVELIA_ESCLARECIMENTO,
            true,
            trx
          );

          logEsclarecimento(
            esclarecimento.toJSON().envolvido.id,
            data,
            esclarecimento.created_at,
            "ESCLARECIMENTO - Vencido"
          );
        }

        esclarecimento.qtd_dias_trabalhados = qtdDiasTrabalhados;

        await esclarecimento.save(trx);
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
        throw new exception(error, 500);
      }
    }
    Database.close();
    process.exit();
  }
}

module.exports = AtualizaPrazosEsclarecimento;
