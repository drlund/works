"use strict";

const { Command } = require("@adonisjs/ace");

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const respostasModel = use("App/Models/Postgres/MtnResposta");
/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const visaoModel = use("App/Models/Postgres/MtnVisao");
/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const dadosQuestionarioModel = use("App/Models/Postgres/MtnDadosQuestionario");
/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const mtnModel = use("App/Models/Postgres/Mtn");
const { getDiasTrabalhados } = use("App/Commons/DateUtils");
const { mtnConsts } = use("Constants");
const { prazosRevelia } = mtnConsts;
/** @type {typeof import('moment')} */
const moment = require("moment");
const Database = use("Database");
const Logger = use("Logger");
const getDataBasePrazo = use("App/Commons/Mtn/getDataBasePrazo");
const isAcoesNoVecimento = use("App/Commons/Mtn/isAcoesNoVecimento");
const logAusencias = use("App/Commons/Mtn/logAusencias");

const calcNrMtn = async () => {
  const lastMtn = await mtnModel.query().orderBy("created_at", "desc").first();

  const serialMtn = (parseInt(lastMtn.nr_mtn.slice(4)) + 1)
    .toString()
    .padStart(5, "0");

  const dataAtual = moment();
  const novoNrMtn =
    (dataAtual.month() + 1).toString().padStart(2, "0") +
    dataAtual.year().toString().slice(-2) +
    serialMtn;

  return novoNrMtn;
};

const logQuestionario = (idResposta, matricula, dataBase, tipo, dataEnvio) => {
  Logger.transport("mtnPrazos").info("====================");
  Logger.transport("mtnPrazos").info(`Tipo: ${tipo} `);
  Logger.transport("mtnPrazos").info(`Id Envolvido: ${idResposta}`);
  Logger.transport("mtnPrazos").info(`Matricula: ${matricula}`);
  Logger.transport("mtnPrazos").info(`Data base: ${dataBase}`);
  Logger.transport("mtnPrazos").info(`Criação Esclarecimento: ${dataEnvio}`);
  Logger.transport("mtnPrazos").info(
    `Timestamp: ${moment().format("YYYY-MM-DD HH:mm:ss")}`
  );
  Logger.transport("mtnPrazos").info("====================");
};

/**
 *   Atualiza os prazos dos questionários dos Questionários MTN.
 *
 */

class AtualizaPrazosQuestionario extends Command {
  static get signature() {
    return "mtn:atualizaPrazosQuestionarios";
  }

  static get description() {
    return "Atualiza os prazos dos questionarios MTN.";
  }

  async handle(args, options) {
    const prazoMaximo = prazosRevelia.QUESTIONARIO;
    
    const respostas = await respostasModel
      .query()
      .where((builder) => {
        builder.whereNull("ts_resposta").orWhereNull("qtd_dias_pendentes");
      })
      .whereNotNull("dt_envio")
      .fetch();
    const respostasParaMtn = {};
    const cacheQtdDias = {};
    let cont = 0;
    for (const respostaPendente of respostas.toJSON()) {
      cont ++;
      this.info(`${cont} / ${respostas.toJSON().length}`);
      const resposta = await respostasModel.find(respostaPendente.id);
      const data = await getDataBasePrazo(resposta.dt_envio, "QUESTIONARIOS");

      if (!resposta) {
        logQuestionario(
          respostaPendente.id,
          respostaPendente.matricula,
          data,
          "Erro - Resposta não encontrada",
          respostaPendente.dt_envio
        );
        continue;
      }

      if (resposta.dt_envio === null) {
        Logger.transport("mtnPrazos").error({
          tipo:
            "Campo dt_envio nulo. Não é possível calcular a quantidade de dias trabalhados",
          id_resposta: resposta.id,
          timestamp: moment().format(),
        });
        continue;
      }

      if (!cacheQtdDias[resposta.id_resposta]) {
        cacheQtdDias[resposta.id_resposta] = await getDiasTrabalhados(
          resposta.matricula,
          data,
          moment().format("YYYY-MM-DD"),
          { func: logAusencias }
        );
      }

      let qtdDiasTrabalhados = cacheQtdDias[resposta.id_resposta];

      resposta.qtd_dias_pendentes = qtdDiasTrabalhados;

      if (qtdDiasTrabalhados > prazoMaximo) {
        resposta.fechado_automaticamente = true;
        resposta.ts_resposta = moment();
        respostasParaMtn[resposta.id_resposta] = { ...resposta.toJSON() };
        logQuestionario(
          resposta.id,
          resposta.matricula,
          data,
          "Questionario - Vencimento",
          resposta.dt_envio
        );
      } else {
        resposta.fechado_automaticamente = false;
      }
      await resposta.save();
    }

    //Caso os prazos não estejam ativos, encerra a rotina.
    const acoesNoVencimento = await isAcoesNoVecimento();
    if (!acoesNoVencimento) {
      Database.close();
      process.exit();
      return;
    }

    for (let idResposta in respostasParaMtn) {
      const { id_visao } = respostasParaMtn[idResposta];
      const visao = await visaoModel.find(id_visao);
      const dadosQuestionario = await dadosQuestionarioModel
        .query()
        .where("id_resposta", idResposta)
        .first();

      if (dadosQuestionario && visao) {
        //Caso a visão esteja configurada para gerar mtn no vencimento
        // a ocorrência mtn será criada
        if (visao.mtn_no_vencimento) {
          const nrMtn = await calcNrMtn();
          const mtn = new mtnModel();

          mtn.nr_mtn = nrMtn;
          mtn.id_visao = id_visao;
          mtn.id_status = 1;
          mtn.prazo_pendencia_analise = 0;

          mtn.mci_associado = dadosQuestionario.mci_associado;
          mtn.identificador_operacao = dadosQuestionario.identificador_operacao;
          mtn.prefixo_ocorrencia = dadosQuestionario.prefixo_ocorrencia;
          mtn.nome_prefixo_ocorrencia =
            dadosQuestionario.nome_prefixo_ocorrencia;
          mtn.prefixo_super_comercial =
            dadosQuestionario.prefixo_super_comercial;
          mtn.nome_super_comercial = dadosQuestionario.nome_super_comercial;
          mtn.prefixo_super_negocial = dadosQuestionario.prefixo_super_negocial;
          mtn.nome_super_negocial = dadosQuestionario.nome_super_negocial;
          mtn.prefixo_unidade_estrategica =
            dadosQuestionario.prefixo_unidade_estrategica;
          mtn.nome_unidade_estrategica =
            dadosQuestionario.nome_unidade_estrategica;
          mtn.desc_ocorrencia = dadosQuestionario.desc_ocorrencia;
          mtn.data_ocorrencia = dadosQuestionario.data_ocorrencia;

          await mtn.save();
        }
      } else {
        Logger.transport("mtnPrazos").error({
          tipo: "DADOS_QUESTIONARIO_VAZIO ou Visão inválida",
          id_resposta: idResposta,
          id_visao: id_visao,
          timestamp: moment().format(),
        });
      }
    }

    Database.close();
    process.exit();
    return;
  }
}

module.exports = AtualizaPrazosQuestionario;
