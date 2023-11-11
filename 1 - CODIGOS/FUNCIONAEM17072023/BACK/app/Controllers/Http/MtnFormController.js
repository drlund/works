("use strict");

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const formulariosModel = use("App/Models/Postgres/MtnFormulario");
/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const respostasModel = use("App/Models/Postgres/MtnResposta");
/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const mtnLogsAcesso = use("App/Models/Postgres/MtnLogAcesso");
/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const respondidaModel = use("App/Models/Postgres/MtnRespondidas");
/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const dadosQuestionarioModel = use("App/Models/Postgres/MtnDadosQuestionario");

const perguntasModel = use("App/Models/Postgres/MtnPergunta");
const { replaceVariable } = use("StringUtils");
const exception = use("App/Exceptions/Handler");
const { validate } = use("Validator");
const TransformerForm = use("App/Transformers/Mtn/MtnFormTransformer");
const TransformerLog = use("App/Transformers/Mtn/MtnLogAcessoTransformer");
const moment = require("moment");
const Logger = use("Logger");
const md5 = require("md5");
//Common queries
const getRespostas = use("App/Commons/Mtn/getRespostas");
const getVisualizado = use("App/Commons/Mtn/getVisualizado");
const Database = use("Database");
class MtnFormController {
  /**
   * Retorna a lista de perguntas para um determinado Hash.
   * GET mtns
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   *
   */

  async getQuestionario({ request, response }) {
    let { idResposta } = request.allParams();
    if (!idResposta) {
      throw new exception("Não foi informado id da resposta!", 400);
    }
    let respostasBD = await respostasModel
      .query()
      .where({ id_resposta: idResposta })
      .orderBy("id_pergunta", "asc")
      .fetch();
    let respostas = respostasBD.toJSON();
    if (!respostas) {
      throw new exception("Não foi encontrada nenhuma resposta!", 404);
    }

    let form = await formulariosModel.find(respostas[0].id_form);
    let jaRespondeu =
      respostas.filter((resposta) => resposta.ts_resposta !== null).length > 0;
    let finalizadoAutomaticamente =
      respostas.filter((resposta) => {
        return resposta.fechado_automaticamente === true;
      }).length > 0;
    for (let i = 0; i < respostas.length; i++) {
      let resposta = respostas[i];
      let perguntaBD = await perguntasModel
        .query()
        .where({
          id_form: resposta.id_form,
          id_pergunta: resposta.id_pergunta,
        })
        .with("tipo")
        .fetch();

      let pergunta = perguntaBD.toJSON()[0];

      if (respostas[i].variaveis) {
        pergunta.nome = replaceVariable(
          pergunta.nome,
          eval(respostas[i].variaveis)
        );
      }

      respostas[i].pergunta = {
        nome: pergunta.nome,
        descricao: pergunta.descricao,
        tipo: pergunta.tipo,
      };
    }

    //Recuperar os dados do questionário
    const dadosQuestionario = await dadosQuestionarioModel.findBy(
      "id_resposta",
      idResposta
    );
    if (dadosQuestionario) {
      await dadosQuestionario.load("visao");
    }

    response.send({
      titulo: form.toJSON().titulo,
      jaRespondeu,
      dadosQuestionario,
      finalizadoAutomaticamente,
      respostas,
    });
  }

  async saveRespostas({ request, response, session }) {
    const schema = {
      respondidos: "required|array",
    };
    let { respondidos } = request.allParams();

    const validation = await validate({ respondidos }, schema);

    if (validation.fails()) {
      throw new exception("Campos obrigatórios não foram informados!", 400);
    }
    const trx = await Database.connection("pgMtn").beginTransaction();
    try {
      for (let respondido of respondidos) {
        Logger.transport("questionarios").error({
          respondido: respondido.value,
          id_resposta: respondido.idResposta,
          id_pergunta: respondido.idPergunta,
          timestamp: moment().format(),
        });

        const respostaOriginal = await respostasModel
          .query()
          .where("id_resposta", respondido.idResposta)
          .where("id_pergunta", respondido.idPergunta)
          .fetch();

        if (respostaOriginal.toJSON().length > 1) {
          Logger.transport("questionarios").error("==========================");
          Logger.transport("questionarios").error("Atualizando vários");
          Logger.transport("questionarios").error(`IdResposta: ${id_resposta}`);
          Logger.transport("questionarios").error(`IdPergunta: ${id_pergunta}`);
          Logger.transport("questionarios").error(`Horário: ${moment()}`);
          Logger.transport("questionarios").error("==========================");
        }

        await respostasModel
          .query()
          .where("id_resposta", respondido.idResposta)
          .where("id_pergunta", respondido.idPergunta)
          .update({ resposta: respondido.value, ts_resposta: moment() });

        const newRespondida = new respondidaModel();
        newRespondida.id_resposta = respondido.idResposta;
        newRespondida.id_pergunta = respondido.idPergunta;
        newRespondida.id_form = respostaOriginal.toJSON()[0].id_form;
        newRespondida.resposta = respondido.value;
        newRespondida.ts_resposta = moment();
        newRespondida.hash = md5(
          respondido.idResposta +
            respondido.idPergunta +
            respondido.value +
            respostaOriginal.toJSON()[0].id_form
        );
        await newRespondida.save(trx);
      }
      await trx.commit();
      return response.ok({ msg: "Formulário respondido com sucesso" });
    } catch (error) {
      await trx.rollback;
      throw new exception(error, 500);
    }
  }

  /**
   *   Método que retorna os questionários.
   *
   */

  async find({ response, injectedParams, session, transform }) {
    let dadosUsuario = session.get("currentUserAccount");
    let { pendentes, admin } = injectedParams;
    const respostas = await getRespostas(dadosUsuario.chave, pendentes, admin);

    for (let resposta of respostas) {
      resposta.pendente = injectedParams.pendentes;
      resposta.visualizado = await getVisualizado(resposta);
    }

    const transformed = await transform.collection(respostas, TransformerForm);
    return response.ok(transformed);
  }

  async getLogs({ request, response, transform }) {
    const schema = {
      matricula: "required|string",
    };

    let { matricula, idResposta } = request.allParams();
    const validation = await validate({ matricula }, schema);

    if (validation.fails()) {
      throw new exception("É obrigatório informar uma matrícula!", 400);
    }

    const DB_logAcesso = await mtnLogsAcesso
      .query()
      .select("*")
      .where("matricula", matricula)
      .where("id_resposta", idResposta)
      .orderBy("ts_acesso", "desc")
      .fetch();

    const logs = DB_logAcesso.toJSON();
    const transformed = await transform.collection(logs, TransformerLog);
    return response.ok(transformed);
  }

  /** Query methods */

  async _getRespostas(matricula, pendentes, admin) {
    const query = respostasModel.query();
    query.distinct("matricula", "id_resposta", "id_form");

    if (pendentes) {
      query.where("ts_resposta", null).where("resposta", null);
    } else {
      query
        .where("ts_resposta", "IS NOT", null)
        .where("resposta", "IS NOT", null);
    }
    if (!admin) {
      query.where("matricula", matricula);
    }
    query.with("form");
    query.with("envioEmail");
    const DB_respostasPendentes = await query.fetch();
    return DB_respostasPendentes.toJSON();
  }

  async _getVisualizado(resposta) {
    const DB_logAcesso = await mtnLogsAcesso
      .query()
      .select("*")
      .distinct("matricula")
      .where("matricula", resposta.matricula)
      .where("id_resposta", resposta.id_resposta)
      .orderBy("ts_acesso", "desc")
      .fetch();
    return DB_logAcesso.toJSON().length > 0;
  }
}

module.exports = MtnFormController;
