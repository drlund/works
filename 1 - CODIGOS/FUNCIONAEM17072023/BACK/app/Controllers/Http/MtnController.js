"use strict";

const hasPermission = use("App/Commons/HasPermission");
const isReadOnly = use("App/Commons/Mtn/isReadOnly");
/* *** Models *** */

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const mtnModel = use("App/Models/Postgres/Mtn");
/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const mtnFechadoSemEnvolvidoModel = use(
  "App/Models/Postgres/MtnFechadoSemEnvolvido"
);
/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const mtnFechadosSemEnvolvidosAnexosModel = use(
  "App/Models/Postgres/MtnFechadosSemEnvolvidosAnexos"
);
/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const envolvidoModel = use("App/Models/Postgres/MtnEnvolvido");
/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const vwMtnPendentesSuper = use("App/Models/Postgres/VwMtnPendentesSuper");
/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const filtragemModel = use("App/Models/Postgres/MtnFiltragens");
/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const medidaModel = use("App/Models/Postgres/MtnMedida");
/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const visaoModel = use("App/Models/Postgres/MtnVisao");
/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const acoesModel = use("App/Models/Postgres/MtnTiposAcao");
/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const timelineModel = use("App/Models/Postgres/MtnTimeline");
/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const esclarecimentoModel = use("App/Models/Postgres/MtnEsclarecimento");
/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const solicitacaoAlterarMedidaModel = use(
  "App/Models/Postgres/MtnAlterarMedida"
);
/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const alterarMedidaAnexo = use("App/Models/Postgres/MtnAlterarMedidaAnexo");
/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const mtnSolicitacaoAlterarMedidaTransformer = use(
  "App/Transformers/Mtn/MtnSolicitacaoAlterarMedidaTransformer"
);
/** @type {typeof import('../../../Commons/Mtn/getNotificacoes')} */
const getNotificacoes = use("App/Commons/Mtn/getNotificacoes");
/** @type {typeof import('../../../Commons/Mtn/limparLocksMtn')} */
const limparLocksMtn = use("App/Commons/Mtn/limparLocksMtn");
/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const prazosModel = use("App/Models/Postgres/MtnPrazo");
/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const configPrazosModel = use("App/Models/Postgres/MtnConfigPrazos");
/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const lockModel = use("App/Models/Postgres/MtnLock");
/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const anexoModel = use("App/Models/Postgres/MtnAnexo");
/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const envolvidoAnexoModel = use("App/Models/Postgres/MtnEnvolvidoAnexo");
/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const recursoModel = use("App/Models/Postgres/MtnRecurso");
/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const statusModel = use("App/Models/Postgres/MtnStatus");
/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const recursoAnexoModel = use("App/Models/Postgres/MtnRecursosAnexo");
/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const esclarecimentosAnexoModel = use(
  "App/Models/Postgres/MtnEsclarecimentoAnexo"
);
/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const historicoUorsModel = use("App/Models/Mysql/HistoricoUors");
/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const historicoComissoesModel = use("App/Models/Mysql/HistoricoComissoes");

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const parecerRecursoAnexoModel = use(
  "App/Models/Postgres/MtnParecerRecursoAnexo"
);

const Analitics = use("App/Models/Postgres/MtnPeopleAnalitics");
const QuestView = use("App/Models/Postgres/MtnQuestionarioView");
const Notificacao = use("App/Models/Postgres/MtnNotificacao");

const { replaceVariable } = use("App/Commons/StringUtils");
const { qtdeTotais } = use("App/Commons/Mtn/qtdeMtnEanaliseEanaliseForaPrazo");
const { listaForaPrazo } = use("App/Commons/Mtn/listaMtnForaPrazo");
const salvarComplementoForaDeAlcance = use(
  "App/Commons/Mtn/salvarComplementoForaDeAlcance"
);

const Database = use("Database");
const getDadosFunci = use("App/Commons/Mtn/getDadosFunci");
const md5 = require("md5");
/* *** Bibliotecas *** */
const { validate } = use("Validator");
const getHistoricoMtn = use("App/Commons/Mtn/getHistoricoMtn");
const notificarEnvolvido = use("App/Commons/Mtn/notificarEnvolvido");
const registrarLogEnvolvidos = use("App/Commons/Mtn/registrarLogEnvolvidos");
const registrarLeituraEsclarecimento = use(
  "App/Commons/Mtn/registrarLeituraEsclarecimento"
);
const registrarLeituraRecurso = use("App/Commons/Mtn/registrarLeituraRecurso");

/** @type {typeof import('moment')} */
// const moment = use("App/Commons/MomentZone");
const moment = require("moment");

const Drive = use("Drive");
var fs = require("fs");
const { orderBy } = require("lodash");
const exception = use("App/Exceptions/Handler");

const Helpers = use("Helpers");

/* *** Transformers  *** */
const MtnTransformerIndex = use("App/Transformers/Mtn/MtnTransformerIndex");
const MtnPendentesSuperTransformer = use(
  "App/Transformers/Mtn/MtnPendentesSuperTransformer"
);
const MtnTransformerFind = use("App/Transformers/Mtn/MtnTransformerFind");
const MtnTimelineTransformer = use(
  "App/Transformers/Mtn/MtnTimelineTransformer"
);
const MeuMtnTransformer = use("App/Transformers/Mtn/MeuMtnTransformer");
const MtnMeusMtnsTransformer = use(
  "App/Transformers/Mtn/MtnMeusMtnsTransformer"
);
const MtnEsclarecimentoTransformer = use(
  "App/Transformers/Mtn/MtnEsclarecimentoTransformer"
);
const MtnTransformerEnvolvido = use(
  "App/Transformers/Mtn/MtnTransformerEnvolvido"
);
const HistoricoMtnTransformer = use(
  "App/Transformers/Mtn/HistoricoMtnTransformer"
);
const LockTransformer = use("App/Transformers/Mtn/MtnLockTransformer");

const ListaPainelDicoiTransformer = use(
  "App/Transformers/Mtn/MtnListaPainelDicoiTransformer"
);

const QuantidadesTransformer = use(
  "App/Transformers/Mtn/MtnQtdsPainelDicoiTransformer"
);

const QuestViewTransformer = use(
  "App/Transformers/Mtn/MtnQuestViewTransformer"
);

const AnaliticsTransformer = use(
  "App/Transformers/Mtn/MtnAnaliticsTransformer"
);

const NotificacoesAnaliseTransformer = use(
  "App/Transformers/Mtn/MtnNotificacoesAnaliseTransformer"
);

const RecursoTransformer = use("App/Transformers/Mtn/RecursoTransformer");
/** @type {typeof import('../../Commons/Constants')} */
const { mtnConsts } = use("Constants");
const {
  mtnStatus,
  filters,
  acoes,
  tiposAnexo,
  pgSchema,
  msgsRevelia,
  medidas,
  acoesInstancias,
  defaultPrefixoAnalise,
  defaultTxtEsclarecimento,
  prefixoAnalise,
  tituloEmail,
  tiposNotificacao,
} = mtnConsts;

const { EM_ANDAMENTO, FINALIZADOS } = filters;

const typeDefs = require("../../Types/TypeUsuarioLogado");
const podeGravarParecerAposRecurso = require("../../Commons/Mtn/podeGravarParecerAposRecurso");

//Common queries
const getRespostas = use("App/Commons/Mtn/getRespostas");
const insereTimeline = use("App/Commons/Mtn/insereTimeline");

/** USE CASES REFACTOR*/

const UcSalvarParecer = require("../../Commons/Mtn/UseCases/UcSalvarParecer");
const UcGetDadosEnvolvido = require("../../Commons/Mtn/UseCases/UcGetDadosEnvolvido");
const UcGetPareceresParaAprovacao = require("../../Commons/Mtn/UseCases/UcGetPareceresParaAprovacao");
const UcAprovarMedidas = require("../../Commons/Mtn/UseCases/UcAprovarMedidas");
const UcAlterarMedidaNaAprovacao = require("../../Commons/Mtn/UseCases/UcAlterarMedidaNaAprovacao");
const UcPesquisarOcorrenciasParaVersionar = require("../../Commons/Mtn/UseCases/UcPesquisarOcorrenciasParaVersionar");
const UcVersionarOcorrencia = require("../../Commons/Mtn/UseCases/UcVersionarOcorrencia");

const EnvolvidoRepository = require("../../Commons/Mtn/repositories/EnvolvidoRepository");
const MedidaRepository = require("../../Commons/Mtn/repositories/MedidaRepository");
const RecursoRepository = require("../../Commons/Mtn/repositories/RecursoRepository");
const AnexoRepository = require("../../Commons/Mtn/repositories/AnexoRepository");
const MtnRepository = require("../../Commons/Mtn/repositories/MtnRepository");

const UCNovaNotaInterna = require("../../Commons/Mtn/UseCases/UCSalvarNovaNotaInterna");
const UCNotasInternas = require("../../Commons/Mtn/UseCases/UCGetNotasInternas");
const UCLeituraNotaInterna = require("../../Commons/Mtn/UseCases/UCRegistrarLeituraNotaInterna");
const NotasInternasRepository = require("../../Commons/Mtn/repositories/NotasInternasRepository");
const UcDevolverMedidaParaAnalise = require("../../Commons/Mtn/UseCases/UcDevolverMedidaParaAnalise");
const { handleAbstractUserCaseError } = use("App/Commons/AbstractUserCase");
/**
 * Inicio da classe MtnController.
 */
class MtnController {
  constructor() {
    this.envolvidoRepository = new EnvolvidoRepository();
    this.medidaRepository = new MedidaRepository();
    this.recursoRepository = new RecursoRepository();
    this.anexoRepository = new AnexoRepository();
    this.mtnRepository = new MtnRepository();
  }

  /**
   *    Retorna listagem de Mtns
   */

  /**
   * @param {object} ctx
   * @param {UsuarioLogado} ctx.usuarioLogado
   */

  async index({ request, response, session, transform, usuarioLogado }) {
    const schema = {
      tipo: "string|required",
    };

    let { tipo, pageSize, page, sortField, sortOrder } = request.allParams();

    if (!page) {
      page = "1";
    }

    if (!pageSize) {
      pageSize = "10";
    }
    let allParams = request.allParams();
    const validation = await validate({ tipo }, schema);

    if (validation.fails() || !this._isStatusValido(tipo)) {
      throw new exception("É obrigatório informar o tipo de MTN", 400);
    }

    let query = mtnModel.query();
    let totalCount = 0;

    let mapFieldsDb = [
      { field: "nrMtn", db: "nr_mtn" },
      { field: "criadoEm", db: "created_at" },
      { field: "prazoPendenciaAnalise", db: "prazo_pendencia_analise" },
      { field: "nomeVisao", db: "desc_visao" },
    ];

    if (tipo === EM_ANDAMENTO) {
      query
        .where((builder) => {
          builder
            .where("id_status", mtnStatus.A_ANALISAR)
            .orWhere("id_status", mtnStatus.EM_ANALISE);
        })
        .with("visao")
        .with("lock");
      query.with("envolvidos").withCount("envolvidos");
    } else if (tipo === FINALIZADOS) {
      query.where("id_status", mtnStatus.FINALIZADO);
      query.with("visao");
      query.with("envolvidos");
    }

    // =============== Filtros textual ================

    //Trata os casos Específicos

    //Por uma questão de limitação da tabela do antDesign, o parâmetro qtdEnvolvidos, quando  pesquisa textual servirá para pesquisar a matrícula
    if (allParams.qtdEnvolvidos) {
      query.whereHas("envolvidos", (builder) => {
        builder.where(
          "matricula",
          "ilike",
          "%" + allParams.qtdEnvolvidos + "%"
        );
      });
    }

    if (allParams.nomeVisao) {
      query.whereHas("visao", (builder) => {
        builder.where("desc_visao", "ilike", "%" + allParams.nomeVisao + "%");
      });
    }

    if (allParams.analistaResponsavel) {
      query.whereHas("lock", (builder) => {
        //Verifica se é uma matrícula completa ou se só tem números
        if (
          /^(F|f)\d{7}$/i.test(allParams.analistaResponsavel) ||
          /^[0-9]*$/i.test(allParams.analistaResponsavel)
        ) {
          builder.where(
            "matricula_analista",
            "ilike",
            "%" + allParams.analistaResponsavel + "%"
          );
        } else {
          builder.where(
            "nome_analista",
            "ilike",
            "%" + allParams.analistaResponsavel + "%"
          );
        }
      });
    }

    //Trata os parâmetros que estão no mapFieldsDb
    for (const elem of mapFieldsDb) {
      if (allParams[elem.field]) {
        query.where(elem.db, "ILIKE", "%" + allParams[elem.field] + "%");
      }
    }

    // =============== Ordenação ================
    if (allParams.sortField && allParams.sortOrder) {
      sortOrder = sortOrder === "ascend" ? "asc" : "desc";
      if (sortField === "nomeVisao") {
        query
          .join(
            "novo_mtn.visoes",
            "novo_mtn.mtns.id_visao",
            "=",
            "novo_mtn.visoes.id"
          )
          .orderBy("desc_visao", sortOrder);
      } else {
        for (const elem of mapFieldsDb) {
          if (sortField === elem.field) {
            query.orderBy(elem.db, sortOrder);
          }
        }
      }
    } else {
      query.orderBy("prazo_pendencia_analise", "desc");
    }
    // ===============Fim da  Ordenação ================

    let mtns = await query.paginate(page, pageSize);

    const transformed = await transform
      .include("lock")
      .collection(mtns.toJSON().data, MtnTransformerIndex);

    return {
      results: transformed,
      totalCount: mtns.toJSON().total,
    };
  }

  async pendentesSuper({
    request,
    response,
    session,
    transform,
    usuarioLogado,
  }) {
    const { somenteUsuario } = request.allParams();
    const { chave } = session.get("currentUserAccount");
    const query = mtnModel.query().whereHas("vwPendentesSuper");

    //Indica se deseja somente os casos avocados pelo usuário
    if (somenteUsuario === "true" || somenteUsuario === true) {
      query.whereHas("lock", (builder) => {
        builder.where("matricula_analista", chave);
      });
    }

    const mtnsSuper = await query
      .with("visao")
      .with("lock")
      .with("envolvidos")
      .with("vwPendentesSuper", (builder) => {
        builder.orderBy("prazo", "desc");
      })
      .withCount("envolvidos")
      .fetch();

    const transformed = await transform
      .include("lock")
      .collection(mtnsSuper.toJSON(), MtnPendentesSuperTransformer);
    return response.ok(transformed);
  }

  async getNotificacoesFilaEnvio({ request, response, session, transform }) {
    const { dataCriacaoNotificacao } = request.allParams();
    const incluirComSucesso = JSON.parse(request.allParams().incluirComSucesso);

    const notificacoes = await getNotificacoes(
      dataCriacaoNotificacao,
      incluirComSucesso
    );
    const notificacoesTransformadas = await transform.collection(
      notificacoes,
      "Mtn/MtnNotificacaoTransformer.ListaNotificacoes"
    );
    return notificacoesTransformadas;
  }

  async ocorrenciasParaReversao({ request, response, session, transform }) {
    const rawParams = request.allParams();
    const parsedParams = JSON.parse(rawParams.params);

    const { nrMtn, matriculaEnvolvido, matriculaAnalista, periodoPesquisa } =
      parsedParams;

    const trx = await Database.connection("pgMtn").beginTransaction();

    const ucPesquisarOcorrenciasParaVersionar =
      new UcPesquisarOcorrenciasParaVersionar({
        repository: {
          envolvido: this.envolvidoRepository,
        },
        trx,
      });

    const { error, payload } = await ucPesquisarOcorrenciasParaVersionar.run({
      nrMtn,
      matriculaEnvolvido,
      matriculaAnalista,
      periodoPesquisa,
    });

    if (error) {
      if (error instanceof Error) {
        throw new exception(error, 500);
      }

      if (error[0] && error[1]) {
        throw new exception(error[0], error[1]);
      }
    }

    const transformed = await transform.collection(
      payload,
      MtnTransformerEnvolvido
    );

    return response.ok(transformed);
  }

  async incluirEnvolvido({ request, response, session, transform }) {
    //Validações
    const schema = {
      matricula: "string|required",
      idMtn: "string|required",
    };

    const { matricula, idMtn } = request.allParams();

    if (matricula.length !== 8) {
      throw new exception("Matrícula inválida", 400);
    }

    const validation = await validate(
      {
        matricula,
        idMtn,
      },
      schema
    );

    if (validation.fails()) {
      throw new exception("A matrícula do envolvido é obrigatório", 400);
    }

    const mtn = await mtnModel.find(idMtn);

    if (!mtn) {
      throw new exception("MTN inválido ", 400);
    }

    await mtn.load("envolvidos");

    const matriculasJaIncluidas = mtn
      .toJSON()
      .envolvidos.map((envolvido) => envolvido.matricula);

    if (matriculasJaIncluidas.includes(matricula.toUpperCase())) {
      throw new exception("Esta funcionário ja foi incluído", 400);
    }

    const data = moment(mtn.data_ocorrencia.toISOString());

    const historicoUor = await historicoUorsModel
      .query()
      .where("matricula", matricula)
      .where("dt_inicio", "<=", data.format("YYYY-MM-DD"))
      .where("dt_final", ">=", data.format("YYYY-MM-DD"))
      .first();

    if (!historicoUor) {
      throw new exception("Uor à época não encontrada ", 400);
    }

    const historicoComissoes = await historicoComissoesModel
      .query()
      .where("matricula", matricula)
      .where("dt_inicio", "<=", data.format("YYYY-MM-DD"))
      .where("dt_final", ">=", data.format("YYYY-MM-DD"))
      .first();

    const { prefixo, nome_prefixo } = historicoUor;
    const { comissao, desc_comissao } = historicoComissoes
      ? historicoComissoes
      : { comissao: "0610", desc_comissao: "ESCRITURARIO" };

    const dadosFunci = await getDadosFunci(matricula);

    if (!dadosFunci) {
      throw new exception("Funcionário não encontrado ", 400);
    }

    const trx = await Database.connection("pgMtn").beginTransaction();
    try {
      //Cria novo Envolvido
      const envolvido = new envolvidoModel();

      envolvido.id_mtn = idMtn;
      envolvido.matricula = matricula;
      envolvido.nome_funci = dadosFunci.nome;
      envolvido.desc_orientacao = mtn.desc_ocorrencia;
      envolvido.resumo_orientacao = mtn.desc_ocorrencia;
      envolvido.cd_cargo_epoca = comissao;
      envolvido.nome_cargo_epoca = desc_comissao;
      envolvido.cd_prefixo_epoca = prefixo;
      envolvido.nome_prefixo_epoca = nome_prefixo;
      envolvido.id_medida = null;
      envolvido.id_medida_prevista = null;
      envolvido.pendente_recurso = false;
      envolvido.dias_desde_ultima_acao = 0;
      envolvido.instancia = acoesInstancias.ENVOLVIDO;
      await envolvido.save(trx);

      //Cria novo esclarecimento
      const esclarecimento = new esclarecimentoModel();
      esclarecimento.id_envolvido = envolvido.id;
      esclarecimento.matricula_solicitante = "F0000000";
      esclarecimento.nome_solicitante = "SISTEMA";
      esclarecimento.cd_prefixo_solicitante = prefixoAnalise;
      esclarecimento.nome_prefixo_solicitante = defaultPrefixoAnalise;
      esclarecimento.txt_pedido = defaultTxtEsclarecimento;
      esclarecimento.prorrogado = false;
      esclarecimento.qtd_dias_trabalhados = 0;
      await esclarecimento.save(trx);

      //Insere na timeline a ação de incluir envolvido
      const notificacaoInclusaoEnvolvido = await insereTimeline(
        envolvido.id,
        acoes.CRIACAO,
        session.get("currentUserAccount"),
        tiposNotificacao.INCLUIR_ENVOLVIDO,
        false,
        trx
      );

      // Insere na timeline a ação do esclarecimento inicial
      await insereTimeline(
        envolvido.id,
        acoes.ESCLARECIMENTO_INICIAL,
        session.get("currentUserAccount"),
        tiposNotificacao.SOLICITACAO_ESCLARECIMENTO,
        false,
        trx
      );

      mtn.id_status = mtnStatus.EM_ANALISE;
      await mtn.save(trx);

      await trx.commit();

      const { tipoNotificacao, idEnvolvido, acao, idNotificacao } =
        notificacaoInclusaoEnvolvido;

      await notificarEnvolvido(
        tipoNotificacao,
        idEnvolvido,
        acao,
        idNotificacao,
        false
      );

      return response.created(envolvido.id);
    } catch (error) {
      //on error faz o rollback
      await trx.rollback();

      if (error.message) {
        throw new exception(error.message, error.status);
      } else {
        throw new exception(error, 500);
      }
    }
  }

  async finalizarMtnSemEnvolvido({ request, response, session }) {
    //Tratamento de campos recebidos via formData
    const campos = [
      "complemento",
      "idMtn",
      "observacao",
      "possuiComplemento",
      "tipoEncerramento",
    ];

    const parametros = request.allParams();

    for (const campo of campos) {
      if (parametros[campo]) {
        parametros[campo] = JSON.parse(parametros[campo]);
      }
    }

    const {
      complemento,
      idMtn,
      observacao,
      possuiComplemento,
      tipoEncerramento,
    } = parametros;

    const dadosUsuario = session.get("currentUserAccount");

    //Início das operações para encerrar sem Envolvido
    const trx = await Database.connection("pgMtn").beginTransaction();
    if (!idMtn) {
      return response.badRequest("Favor informar o id do Mtn");
    }

    if (!observacao) {
      return response.badRequest("Obrigatório informar a justificativa");
    }

    try {
      const mtn = await mtnModel.find(idMtn);

      if (!mtn) {
        throw new exception("Id do mtn inválido", 400);
      }

      if (mtn.id_status === mtnStatus.FINALIZADO) {
        throw new exception("Ocorrência MTN já finalizada", 400);
      }

      await mtn.load("envolvidos");
      if (mtn.toJSON().envolvidos.length > 0) {
        throw new exception(
          "Este mtn possui envolvidos vinculados. Não é possível encerrá-lo diretamente.",
          400
        );
      }

      mtn.id_status = mtnStatus.FINALIZADO;
      await mtn.save(trx);

      const mtnFechadosSemEnvolvido = new mtnFechadoSemEnvolvidoModel();
      mtnFechadosSemEnvolvido.prefixo_responsavel = dadosUsuario.prefixo;
      mtnFechadosSemEnvolvido.nome_responsavel = dadosUsuario.nome_usuario;
      mtnFechadosSemEnvolvido.nome_prefixo_responsavel =
        dadosUsuario.dependencia;
      mtnFechadosSemEnvolvido.matricula_responsavel = dadosUsuario.chave;
      mtnFechadosSemEnvolvido.justificativa = observacao;
      mtnFechadosSemEnvolvido.id_mtn = idMtn;
      await mtnFechadosSemEnvolvido.save(trx);

      const idsAnexos = await this._salvarAnexosRequest(
        request,
        tiposAnexo.MTN_FECHADO_SEM_ENVOLVIDOS,
        mtnFechadosSemEnvolvido.id,
        dadosUsuario,
        trx
      );

      //Caso possua complemento, salvar os dados do mesmo
      if (possuiComplemento) {
        await salvarComplementoForaDeAlcance(
          tipoEncerramento,
          idMtn,
          complemento,
          dadosUsuario,
          idsAnexos,
          observacao,
          trx
        );
      }
      await trx.commit();
    } catch (error) {
      await trx.rollback();
      if (error.message) {
        throw new exception(error.message, error.status);
      } else {
        throw new exception(
          "Falha ao encerrar o MTN! Contate o administrador do sistema.",
          400
        );
      }
    }

    return response.ok("Mtn fechado sem envolvidos.");
  }

  async find({ request, response, session, transform }) {
    //Validação
    const schema = {
      idMtn: "string|required",
    };

    const { idMtn } = request.allParams();

    const validation = await validate(
      {
        idMtn,
      },
      schema
    );

    if (validation.fails()) {
      throw new exception("O número do MTN é obrigatório", 400);
    }

    let mtn = await mtnModel.find(idMtn);
    if (!mtn) {
      throw new exception("Id do mtn inválido", 400);
    }
    await mtn.load("envolvidos", (builder) => {
      builder.with("esclarecimentos");
    });

    await mtn.load("visao");
    await mtn.load("status");
    await mtn.load("lock");
    await mtn.load("fechadoSemEnvolvido", (builder) => {
      builder.with("anexos", (builder) => {
        builder.with("dadosAnexo");
      });
    });

    const medidas = await medidaModel.query().where("ativa", true).fetch();
    mtn = mtn.toJSON();
    mtn.medidas = medidas.toJSON();

    const dadosUsuario = session.get("currentUserAccount");
    mtn.readOnly = await isReadOnly(dadosUsuario);

    const transformed = await transform
      .include("lock")
      .item(mtn, MtnTransformerFind);
    return response.ok(transformed);
  }

  async save({ request, response, session }) {
    const { nr_mtn, id_visao, mci_associado, identificador_operacao, status } =
      request.allParams();
    let newMtn = {};

    try {
      newMtn = new mtnModel();
      newMtn.nr_mtn = nr_mtn;
      newMtn.id_visao = id_visao;
      newMtn.mci_associado = mci_associado;
      newMtn.identificador_operacao = identificador_operacao;
      newMtn.status = status;

      await newMtn.save();
    } catch (error) {
      response.badRequest();
    }

    response.ok(newMtn);
  }

  async getMedidas({ request, response }) {
    const medidas = await medidaModel.query().fetch();

    return response.ok(
      medidas.toJSON().map((medida) => {
        return { id: medida.id, txtMedida: medida.txt_medida };
      })
    );
  }

  async getStatus({ request, response }) {
    const status = await statusModel.query().fetch();

    // return response.ok(medidas.toJSON().map(medida => {return {id: medida.id, txtMedida: medida.txt_medida}}));
    return response.ok(
      status.toJSON().map((status) => {
        return { id: status.id, descricao: status.descricao };
      })
    );
  }

  async getAcoes({ request, response }) {
    const acoes = await acoesModel.query().where("filtro", true).fetch();
    return response.ok(
      acoes.toJSON().map((acao) => {
        return { id: acao.id, value: acao.tipo, display: acao.nome_filtro };
      })
    );
  }

  async getVisoes({ request, response }) {
    const visoes = await visaoModel.query().fetch();

    // return response.ok(medidas.toJSON().map(medida => {return {id: medida.id, txtMedida: medida.txt_medida}}));
    return response.ok(
      visoes.toJSON().map((visao) => {
        return { id: visao.id, descricao: visao.origem_visao };
      })
    );
  }

  async getEnvolvido({ request, response, session, transform }) {
    const schema = {
      idEnvolvido: "number|required",
    };

    const { idEnvolvido } = request.allParams();

    const validation = await validate(
      {
        idEnvolvido,
      },
      schema
    );

    if (validation.fails()) {
      throw new exception("Obrigatório informar id do envolvido", 400);
    }

    let envolvido = await envolvidoModel.find(idEnvolvido);
    await envolvido.load("medida");
    await envolvido.load("medidaSugerida");
    await envolvido.load("aprovacoesMedida", (builder) => {
      builder.with("medidaProposta");
      builder.with("medidaAprovada");
    });
    await envolvido.load("mtn");
    await envolvido.load("alteracoesMedida", (builder) => {
      builder.whereNotNull("dt_confirmacao_solicitacao");
      builder.with("medidaAntiga");
      builder.with("medidaNova");
      builder.with("anexos", (builder) => builder.with("dadosAnexo"));
    });
    await envolvido.load("anexos", (builder) => builder.with("dadosAnexo"));
    await envolvido.load("esclarecimentos", (builder) => {
      builder.orderBy("created_at", "desc");
      builder.with("anexos", (builder) => {
        builder.with("dadosAnexo");
      });
    });
    await envolvido.load("recursos", (builder) => {
      builder.with("medida");
      builder.with("anexos", (builder) => builder.with("dadosAnexo"));
      builder.with("anexosParecer", (builder) => builder.with("dadosAnexo"));
    });

    await envolvido.load("timeline", (builder) => {
      builder.with("acao");
      builder.orderBy("id", "asc");
    });
    await envolvido.load("notasInternas");
    await envolvido.load("logs");
    await envolvido.load("notasInternasLidas");

    const transformed = await transform
      .include(
        "anexos,esclarecimentos,timeline,historico,recursos,alteracoesMedida,logs,aprovacoesMedida"
      )
      .item(envolvido.toJSON(), MtnTransformerEnvolvido);
    return response.ok(transformed);
  }

  async getEnvolvidos({ request, response, session, transform }) {
    const schema = {
      idMtn: "number|required",
    };

    const { idMtn } = request.allParams();

    const validation = await validate(
      {
        idMtn,
      },
      schema
    );

    if (validation.fails()) {
      throw new exception("Obrigatório informar id do mtn", 400);
    }

    let envolvidos = await envolvidoModel
      .query()
      .where({ id_mtn: idMtn, versionado: false })
      .with("medida")
      .with("medidaSugerida")
      .with("aprovacoesMedida", (builder) => {
        builder.with("medidaProposta");
        builder.with("medidaAprovada");
      })
      .with("mtn")
      .with("alteracoesMedida", (builder) => {
        builder.whereNotNull("dt_confirmacao_solicitacao");
        builder.with("medidaAntiga");
        builder.with("medidaNova");
        builder.with("anexos", (builder) => builder.with("dadosAnexo"));
      })
      .with("anexos", (builder) => builder.with("dadosAnexo"))
      .with("esclarecimentos", (builder) => {
        builder.orderBy("created_at", "desc");
        builder.with("anexos", (builder) => {
          builder.with("dadosAnexo");
        });
      })
      .with("recursos", (builder) => {
        builder.with("medida");
        builder.with("anexos", (builder) => builder.with("dadosAnexo"));
        builder.with("anexosParecer", (builder) => builder.with("dadosAnexo"));
      })

      .with("timeline", (builder) => {
        builder.with("acao");
        builder.orderBy("id", "asc");
      })
      .with("logs")
      .with("notasInternas")
      .with("notasInternasLidas")
      .orderBy("nome_funci", "asc")
      .fetch();
    const transformed = await transform
      .include(
        "anexos,esclarecimentos,timeline,historico,recursos,alteracoesMedida,logs,aprovacoesMedida"
      )
      .collection(envolvidos.toJSON(), MtnTransformerEnvolvido);
    return response.ok(transformed);
  }

  async getHistoricoEnvolvido({ request, response, session, transform }) {
    const schema = {
      matricula: "string|required",
    };

    const { matricula } = request.allParams();

    const validation = await validate(
      {
        matricula,
      },
      schema
    );

    if (validation.fails()) {
      throw new exception("Obrigatório informar uma matrícula", 400);
    }

    const mtnsHistorico = await getHistoricoMtn(matricula);
    const transformed = await transform.collection(
      mtnsHistorico.toJSON(),
      HistoricoMtnTransformer
    );

    return response.ok(transformed);
  }

  async solicitarEsclarecimento({ request, response, session, transform }) {
    const { idEnvolvido, txtEsclarecimento } = request.allParams();
    //Salvar o esclarecimento
    const envolvido = await envolvidoModel.find(idEnvolvido);
    if (!envolvido) {
      throw new exception("Envolvido inválido", 400);
    }

    /** @type {typeDefs.UsuarioLogado} */
    const dadosUsuario = session.get("currentUserAccount");

    const trx = await Database.connection("pgMtn").beginTransaction();
    try {
      await envolvido.esclarecimentos().create(
        {
          matricula_solicitante: dadosUsuario.chave,
          nome_solicitante: dadosUsuario.nome_usuario,
          cd_prefixo_solicitante: dadosUsuario.prefixo,
          nome_prefixo_solicitante: dadosUsuario.dependencia,
          txt_pedido: txtEsclarecimento,
          txt_resposta: null,
          respondido_em: null,
        },
        trx
      );

      //Salvar na timeline
      const notificacaoSolicitaEsclarecimento = await this._executarAcao(
        acoes.SOLICITA_ESCLARECIMENTO,
        dadosUsuario,
        idEnvolvido,
        trx
      );
      await trx.commit();

      await notificarEnvolvido(
        notificacaoSolicitaEsclarecimento.tipoNotificacao,
        notificacaoSolicitaEsclarecimento.idEnvolvido,
        notificacaoSolicitaEsclarecimento.acao,
        notificacaoSolicitaEsclarecimento.idNotificacao,
        false
      );
    } catch (error) {
      await trx.rollback();
      throw new exception(error, 500);
    }

    await envolvido.reload();
    await envolvido.load("esclarecimentos", (builder) => {
      builder.with("anexos", (builder) => builder.with("dadosAnexo"));
      builder.orderBy("created_at", "desc");
    });
    await envolvido.load("timeline", (builder) => {
      builder.orderBy("id", "asc");
    });
    //Enviar resposta positiva

    const transformed = await transform.collection(
      envolvido.toJSON().esclarecimentos,
      MtnEsclarecimentoTransformer
    );
    return response.ok(transformed);
  }

  async getTimelineAnalise({ request, response, session, transform }) {
    const { idEnvolvido } = request.allParams();
    const timeline = await timelineModel
      .query()
      .where("id_envolvido", idEnvolvido)
      .with("acao")
      .orderBy("id", "asc")
      .fetch();

    const transformed = await transform.collection(
      timeline.toJSON(),
      MtnTimelineTransformer
    );
    response.ok(transformed);
  }

  async getEsclarecimentos({ request, response, session, transform }) {
    const { idEnvolvido } = request.allParams();
    const esclarecimentos = await esclarecimentoModel
      .query()
      .where("id_envolvido", idEnvolvido)
      .orderBy("created_at", "desc")
      .fetch();
    const transformed = await transform.collection(
      esclarecimentos.toJSON(),
      MtnEsclarecimentoTransformer
    );
    return response.ok(transformed);
  }

  async salvarRecurso({ request, response, session, transform }) {
    const { idRecurso, txtRecurso } = request.allParams();
    const dadosUsuario = session.get("currentUserAccount");
    const matricula = dadosUsuario.chave;

    let recurso = await recursoModel.find(idRecurso);

    // Verificar se já foi respondido
    if (recurso.respondido_em || recurso.revelia_em) {
      throw new exception("Recurso já respondido", 401);
    }

    //Verificar se o usuário é o envolvido em questão
    const envolvido = await envolvidoModel.find(recurso.id_envolvido);
    if (envolvido.matricula !== matricula) {
      throw new exception(
        "Funcionário não autorizado para responder este recurso",
        401
      );
    }

    const trx = await Database.connection("pgMtn").beginTransaction();
    try {
      //Atualiza os dados do recurso (texto, data de resposta, eventuais anexos)
      recurso.txt_recurso = txtRecurso;
      recurso.respondido_em = moment();
      await recurso.save(trx);

      await this._salvarAnexosRequest(
        request,
        tiposAnexo.RECURSO,
        idRecurso,
        dadosUsuario,
        trx
      );

      //Retira a pendencia de recurso do envolvido
      envolvido.pendente_recurso = false;
      await envolvido.save(trx);

      //Executar ação de responder recurso
      const notificacao = await this._executarAcao(
        acoes.RESPONDER_RECURSO,
        dadosUsuario,
        envolvido.id,
        trx
      );

      await trx.commit();

      await notificarEnvolvido(
        notificacao.tipoNotificacao,
        notificacao.idEnvolvido,
        notificacao.acao,
        notificacao.idNotificacao,
        false
      );
    } catch (error) {
      await trx.rollback();
      throw new exception(error, 500);
    }

    const dadosMtn = await this._returnMeuMtn(envolvido.id_mtn, matricula);

    const transformed = await transform.item(
      dadosMtn.toJSON(),
      MeuMtnTransformer
    );
    response.ok(transformed);
  }

  async getMeuMtn({ request, response, session, transform }) {
    const dadosUsuario = session.get("currentUserAccount");
    const matricula = dadosUsuario.chave;
    const { idMtn, idEnvolvido } = request.allParams();
    const dadosMtn = await this._returnMeuMtn(idMtn, matricula, idEnvolvido);

    const transformed = await transform.item(
      dadosMtn.toJSON(),
      MeuMtnTransformer
    );

    const trx = await Database.connection("pgMtn").beginTransaction();
    try {
      await registrarLogEnvolvidos(
        dadosUsuario,
        "ACESSO_OCORRENCIA",
        transformed.dadosEnvolvido.idEnvolvido,
        trx
      );

      const esclarecimentos = transformed.dadosEnvolvido.esclarecimentosMeuMtn;
      for (const esclarecimento of esclarecimentos) {
        await registrarLeituraEsclarecimento(esclarecimento, dadosUsuario, trx);
      }

      const recursos = transformed.dadosEnvolvido.recursosMeuMtn;
      for (const recurso of recursos) {
        await registrarLeituraRecurso(recurso, dadosUsuario, trx);
      }

      await trx.commit();
    } catch (error) {
      await trx.rollback();
      if (error.message) {
        throw new exception(error.message, error.status);
      } else {
        throw new exception(
          "Falha ao encerrar o MTN! Contate o administrador do sistema.",
          400
        );
      }
    }

    return response.ok(transformed);
  }

  async getStatusMtn({ request, response }) {
    const { A_ANALISAR, EM_ANALISE, FINALIZADO } = mtnStatus;

    let { idMtn } = request.allParams();
    const mtnDB = await mtnModel.find(idMtn);
    await mtnDB.load("status");
    const mtn = mtnDB.toJSON();
    let status = "";
    switch (mtn.status.id) {
      case A_ANALISAR:
        status = "A analisar";
        break;
      case EM_ANALISE:
        status = "Em análise";
        break;
      case FINALIZADO:
        status = "Finalizado";
        break;
      default:
        status = "STATUS INVÁLIDO";
        break;
    }

    return { idStatus: mtn.id_status, status };
  }

  async getMeusMtns({ request, response, session, transform }) {
    const dadosUsuario = session.get("currentUserAccount");
    const matricula = dadosUsuario.chave;

    const meusMtns = {
      interacoesPendentes: [],
      mtnsPendentes: [],
      mtnsFinalizados: [],
    };

    const interacoesPendentes = await this._getInteracoesPendentes(matricula);
    const mtnsPendentes = await this._getEnvolvimentos(true, matricula);
    const mtnsFinalizados = await this._getEnvolvimentos(false, matricula);

    meusMtns.interacoesPendentes = interacoesPendentes;

    meusMtns.mtnsFinalizados = await transform.collection(
      mtnsFinalizados,
      MtnMeusMtnsTransformer
    );

    meusMtns.mtnsPendentes = await transform.collection(
      mtnsPendentes,
      MtnMeusMtnsTransformer
    );

    return response.ok(meusMtns);
  }

  async salvarForaAlcance({ request, response, session, transform }) {
    const params = request.allParams();

    const idMtn = JSON.parse(params.idMtn);
    const listaForaAlcance = JSON.parse(params.listaForaAlcance);
    const { observacao, tipoComplemento } = params;
    const dadosUsuario = session.get("currentUserAccount");

    const trx = await Database.connection("pgMtn").beginTransaction();

    try {
      const idsAnexos = await this._salvarAnexosRequest(
        request,
        null,
        null,
        dadosUsuario,
        trx
      );

      await salvarComplementoForaDeAlcance(
        tipoComplemento,
        idMtn,
        listaForaAlcance,
        dadosUsuario,
        idsAnexos,
        observacao,
        trx
      );

      await trx.commit();
      return response.ok("Complemento salvo com sucesso");
    } catch (error) {
      await trx.rollback();
      if (error.message) {
        throw new exception(error.message, error.status);
      } else {
        throw new exception(
          "Falha ao encerrar o MTN! Contate o administrador do sistema.",
          400
        );
      }
    }
  }

  /**
   *  Nova versão do método Salvar Parecer, utilizando o padrão de casos de uso. Posteriormente, substituirá o método salvarParecer
   */

  async salvarParecer({ request, response, session, transform, parsedParams }) {
    const dadosUsuario = session.get("currentUserAccount");

    const {
      idEnvolvido,
      txtParecer,
      idMedida,
      finalizar,
      finalizarSemConsultarDedip,
      nrGedip,
    } = parsedParams;

    const trx = await Database.connection("pgMtn").beginTransaction();
    const envolvidoRepository = new EnvolvidoRepository();
    const medidaRepository = new MedidaRepository();
    const recursoRepository = new RecursoRepository();
    const anexoRepository = new AnexoRepository();
    const arquivos = this._getFiles(request);
    const ucSalvarParecer = new UcSalvarParecer({
      repository: {
        anexo: anexoRepository,
        envolvido: envolvidoRepository,
        medida: medidaRepository,
        recurso: recursoRepository,
      },
      functions: {
        // A função foi passada dessa maneira para preservar o escopo do `this`
        executarAcao: async (acaoExecutada, dadosUsuario, idEnvolvido, trx) =>
          await this._executarAcao(
            acaoExecutada,
            dadosUsuario,
            idEnvolvido,
            trx
          ),
        insereTimeline: async ({
          idEnvolvido,
          idAcao,
          dadosRespAcao,
          tipoNotificacao,
          trx,
        }) => {
          await insereTimeline(
            idEnvolvido,
            idAcao,
            dadosRespAcao,
            tipoNotificacao,
            false,
            trx
          );
        },
      },
      trx,
    });

    const { error, payload } = await ucSalvarParecer.run({
      arquivos,
      dadosUsuario,
      idEnvolvido,
      txtParecer,
      idMedida,
      finalizar,
      finalizarSemConsultarDedip,
      nrGedip,
    });

    if (error) {
      if (error instanceof Error) {
        throw new exception(error, 500);
      }

      if (error[0] && error[1]) {
        throw new exception(error[0], error[1]);
      }
    }

    const ucGetDadosEnvolvido = new UcGetDadosEnvolvido({
      repository: {
        envolvido: envolvidoRepository,
      },
    });

    const resultadoDadosEnvolvido = await ucGetDadosEnvolvido.run({
      idEnvolvido,
    });

    if (resultadoDadosEnvolvido.error) {
      if (resultadoDadosEnvolvido.error instanceof Error) {
        throw new exception(resultadoDadosEnvolvido.error, 500);
      }

      if (
        resultadoDadosEnvolvido.error.msg &&
        resultadoDadosEnvolvido.error.code
      ) {
        throw new exception(
          resultadoDadosEnvolvido.error.msg,
          resultadoDadosEnvolvido.error.code
        );
      }
    }

    const transformed = await transform
      .include("anexos,esclarecimentos,timeline,recursos")
      .item(resultadoDadosEnvolvido.payload, MtnTransformerEnvolvido);

    return response.ok(transformed);
  }

  async getPareceresParaAprovar({ request, response, session, transform }) {
    const envolvidoRepository = new EnvolvidoRepository();
    const ucGetPareceresParaAprovacao = new UcGetPareceresParaAprovacao({
      repository: {
        envolvido: envolvidoRepository,
      },
    });

    const { error, payload } = await ucGetPareceresParaAprovacao.run({});

    if (error) {
      if (error instanceof Error) {
        throw new exception(error, 500);
      }

      if (error.msg && error.code) {
        throw new exception(error.msg, error.code);
      }
    } else {
      return response.ok(payload);
    }
  }

  async devolverMedidaParaAprovacao({ request, response, session, transform }) {
    const { idEnvolvido } = request.allParams();

    const dadosUsuario = session.get("currentUserAccount");
    const trx = await Database.connection("pgMtn").beginTransaction();

    const ucDevolverMedidaParaAnalise = new UcDevolverMedidaParaAnalise({
      repository: {
        envolvido: this.envolvidoRepository,
      },
      functions: {
        insereTimeline: async ({
          idEnvolvido,
          idAcao,
          dadosRespAcao,
          tipoNotificacao,
          trx,
        }) => {
          await insereTimeline(
            idEnvolvido,
            idAcao,
            dadosRespAcao,
            tipoNotificacao,
            false,
            trx
          );
        },
      },
      trx,
    });

    await ucDevolverMedidaParaAnalise.run({ idEnvolvido, dadosUsuario });

    return response.ok("Devolvido");
  }

  async aprovarMedidaIndividual({ request, response, session, transform }) {
    const { idEnvolvido, deveAlterarMedida, novaMedida, novoParecer } =
      request.allParams();

    const dadosUsuario = session.get("currentUserAccount");
    const trx = await Database.connection("pgMtn").beginTransaction();

    if (deveAlterarMedida === true) {
      const ucAlterarMedidaNaAprovacao = new UcAlterarMedidaNaAprovacao({
        repository: {
          anexo: this.anexoRepository,
          envolvido: this.envolvidoRepository,
          medida: this.medidaRepository,
          recurso: this.recursoRepository,
        },
        functions: {
          // A função foi passada dessa maneira para preservar o escopo do `this`
          executarAcao: async (acaoExecutada, dadosUsuario, idEnvolvido, trx) =>
            await this._executarAcao(
              acaoExecutada,
              dadosUsuario,
              idEnvolvido,
              trx
            ),
          insereTimeline: async ({
            idEnvolvido,
            idAcao,
            dadosRespAcao,
            tipoNotificacao,
            trx,
          }) => {
            await insereTimeline(
              idEnvolvido,
              idAcao,
              dadosRespAcao,
              tipoNotificacao,
              false,
              trx
            );
          },
        },
        autoCommitTrx: false,
        trx,
      });

      await ucAlterarMedidaNaAprovacao.run({
        idEnvolvido,
        novaMedida,
        novoParecer,
        dadosUsuario,
      });
    }

    await this._runUcAprovarMedida([idEnvolvido], dadosUsuario, false, trx);

    return response.ok("Medida aprovada");
  }

  async aprovarMedidasLote({ request, response, session, transform }) {
    const { idsEnvolvidos } = request.allParams();
    const trx = await Database.connection("pgMtn").beginTransaction();

    const dadosUsuario = session.get("currentUserAccount");

    await this._runUcAprovarMedida(idsEnvolvidos, dadosUsuario, true, trx);

    return response.ok("Aprovação das medidas");
  }

  async versionarOcorrencia({ request, response, session, transform }) {
    const { idEnvolvido } = request.allParams();
    const trx = await Database.connection("pgMtn").beginTransaction();

    const dadosUsuario = session.get("currentUserAccount");
    const agora = moment().format("YYYY-MM-DD");

    const ucVersionarOcorrencia = new UcVersionarOcorrencia({
      repository: {
        envolvido: this.envolvidoRepository,
        mtn: this.mtnRepository,
      },
      functions: {
        insereTimeline,
      },
      trx,
    });

    const { error, payload } = await ucVersionarOcorrencia.run({
      idEnvolvido,
      dadosUsuario,
      agora,
    });

    if (error) {
      if (error instanceof Error) {
        throw new exception(error, 500);
      }

      if (error.msg && error.code) {
        throw new exception(error.msg, error.code);
      }
    } else {
      return response.ok(payload);
    }
  }

  async _runUcAprovarMedida(
    idsEnvolvidos,
    dadosUsuario,
    deveRegistrarAprovacao,
    trx
  ) {
    const ucAprovarMedidas = new UcAprovarMedidas({
      repository: {
        anexo: this.anexoRepository,
        envolvido: this.envolvidoRepository,
        medida: this.medidaRepository,
        recurso: this.recursoRepository,
      },
      functions: {
        // A função foi passada dessa maneira para preservar o escopo do `this`
        executarAcao: (acaoExecutada, dadosUsuario, idEnvolvido, trx) =>
          this._executarAcao(acaoExecutada, dadosUsuario, idEnvolvido, trx),
      },
      trx,
    });

    const { error, payload } = await ucAprovarMedidas.run({
      idsEnvolvidos,
      usuarioLogado: dadosUsuario,
      deveRegistrarAprovacao,
    });

    if (error) {
      if (error instanceof Error) {
        throw new exception(error, 500);
      }

      if (error[0] && error[1]) {
        throw new exception(error[0], error[1]);
      }
    }

    // Essa função fica fora do useCase pois precisa ser executada após o encerramento da transaction
    if (payload) {
      for (const notificacao of payload) {
        await notificarEnvolvido(
          notificacao.tipoNotificacao,
          notificacao.idEnvolvido,
          notificacao.acao,
          notificacao.idNotificacao,
          false
        );
      }
    }
  }

  async removeAnexo({ request, response }) {
    const { idAnexo } = request.allParams();
    try {
      await envolvidoAnexoModel.query().where("id_anexo", idAnexo).delete();
      const anexo = await anexoModel.find(idAnexo);
      await anexo.delete();
      response.ok("Anexo excluído com sucesso");
    } catch ({ message }) {
      throw new exception("Erro ao excluir o anexo", 500);
    }
  }

  async downloadAnexo({ request, response }) {
    const { idAnexo } = request.allParams();
    const anexo = await anexoModel.find(idAnexo);

    let tmpFileName = Helpers.appRoot("/cache/") + anexo.nome_arquivo;
    let bufferFile = new Buffer.from(anexo.base64, "base64");
    fs.writeFileSync(tmpFileName, bufferFile);
    response.attachment(tmpFileName);
    const exists = await Drive.exists(tmpFileName);

    if (exists) {
      await Drive.delete(tmpFileName);
    }
  }

  async salvarEsclarecimento({ request, response, session, transform }) {
    const dadosUsuario = session.get("currentUserAccount");

    //Salvar dados do parecer
    const { txtEsclarecimento, idEsclarecimento } = request.allParams();
    const esclarecimento = await esclarecimentoModel.find(idEsclarecimento);

    const trx = await Database.connection("pgMtn").beginTransaction();
    try {
      esclarecimento.respondido_em = moment();
      esclarecimento.txt_resposta = txtEsclarecimento;
      await esclarecimento.save(trx);

      await this._salvarAnexosRequest(
        request,
        tiposAnexo.ESCLARECIMENTO,
        idEsclarecimento,
        dadosUsuario,
        trx
      );

      const notificacaoRespostaEsclarecimento = await this._executarAcao(
        acoes.RESPONDE_ESCLARECIMENTO,
        dadosUsuario,
        esclarecimento.id_envolvido,
        trx
      );

      await trx.commit();

      await notificarEnvolvido(
        notificacaoRespostaEsclarecimento.tipoNotificacao,
        notificacaoRespostaEsclarecimento.idEnvolvido,
        notificacaoRespostaEsclarecimento.acao,
        notificacaoRespostaEsclarecimento.idNotificacao,
        false
      );
    } catch (error) {
      await trx.rollback();
      throw new exception(error, 500);
    }

    const esclarecimentos = await esclarecimentoModel
      .query()
      .where("id_envolvido", esclarecimento.id_envolvido)
      .with("anexos", (builder) => {
        builder.with("dadosAnexo");
      })
      .orderBy("id", "asc")
      .fetch();
    const transformed = await transform.collection(
      esclarecimentos.toJSON(),
      MtnEsclarecimentoTransformer
    );
    response.ok(transformed);
  }

  async prorrogarEsclarecimento({ request, response, session, transform }) {
    const { idEsclarecimento } = request.allParams();

    const esclarecimento = await esclarecimentoModel.find(idEsclarecimento);
    await esclarecimento.load("envolvido");

    const trx = await Database.connection("pgMtn").beginTransaction();
    try {
      esclarecimento.prorrogado = true;
      await esclarecimento.save(trx);
      await trx.commit();
    } catch (error) {
      await trx.rollback();
      throw new exception(error, 500);
    }

    const transformed = await transform.item(
      esclarecimento.toJSON(),
      MtnEsclarecimentoTransformer
    );
    response.ok(transformed);
  }

  async confirmarAlteracaoMedida({ request, response, session, transform }) {
    const { idSolicitacao } = request.allParams();

    /** @type {typeDefs.UsuarioLogado} */
    const dadosUsuario = session.get("currentUserAccount");

    if (!idSolicitacao) {
      throw new exception(
        "Obrigatório informar o Id da Solicitação de Reversão.",
        400
      );
    }

    const solicitacaoAlteracao = await solicitacaoAlterarMedidaModel.find(
      idSolicitacao
    );

    // Recuperar o envolvido
    const envolvido = await envolvidoModel.find(
      solicitacaoAlteracao.id_envolvido
    );
    if (!envolvido) {
      throw new exception("Envolvido inválido", 400);
    }

    //Criar Transaction
    const trx = await Database.connection("pgMtn").beginTransaction();

    try {
      // Alterar a medida antiga para a nova
      envolvido.id_medida = solicitacaoAlteracao.id_medida_nova;
      await envolvido.save(trx);
      // Gravar a dados da confirmação
      solicitacaoAlteracao.matricula_confirmacao = dadosUsuario.chave;
      solicitacaoAlteracao.nome_confirmacao = dadosUsuario.nome_usuario;
      solicitacaoAlteracao.prefixo_confirmacao = dadosUsuario.prefixo;
      solicitacaoAlteracao.nome_prefixo_confirmacao = dadosUsuario.dependencia;
      solicitacaoAlteracao.cd_cargo_confirmacao = dadosUsuario.cod_funcao;
      solicitacaoAlteracao.cargo_confirmacao = dadosUsuario.nome_funcao;
      solicitacaoAlteracao.dt_confirmacao_solicitacao = moment();

      await solicitacaoAlteracao.save(trx);
      await this._executarAcao(
        acoes.CONFIRMA_ALTERACAO_MEDIDA,
        dadosUsuario,
        envolvido.id,
        trx
      );
      await trx.commit(trx);
    } catch (error) {
      await trx.rollback();
      if (error.message) {
        throw new exception(error.message, error.status);
      } else {
        throw new exception("Falha do sistema tente novamente", 400);
      }
    }

    return response.ok();
  }

  async excluirAlteracaoMedida({ request, response, session, transform }) {
    const { idSolicitacao } = request.allParams();
    if (!idSolicitacao) {
      throw new exception("Obrigatório informar o Id da Reversão.", 400);
    }

    const solicitacaoAlteracao = await solicitacaoAlterarMedidaModel.find(
      idSolicitacao
    );
    if (!solicitacaoAlteracao) {
      throw new exception("Solicitação não encontrada.", 404);
    }

    if (solicitacaoAlteracao.dt_confirmacao_solicitacao) {
      throw new exception(
        "Não é possível excluir uma Solicitação já confirmada.",
        400
      );
    }
    await alterarMedidaAnexo
      .query()
      .where("id_alteracao_medida", idSolicitacao)
      .delete();

    await solicitacaoAlteracao.delete();

    response.ok();
  }

  async solicitarAlterarMedida({ request, response, session }) {
    const { idEnvolvido, txtJustificativa, novaMedida } = request.allParams();

    //Recuperar dados do parecer incluído anteriormente
    const envolvido = await envolvidoModel.find(idEnvolvido);
    if (!envolvido) {
      throw new exception("Envolvido inválido", 400);
    }

    //Verifica se já existe solicitação para reverter a análise e esteja pendente de confirmação
    const solicitacoesPendentes = await solicitacaoAlterarMedidaModel
      .query()
      .where("id_envolvido", idEnvolvido)
      .where("dt_confirmacao_solicitacao", null)
      .fetch();

    if (solicitacoesPendentes.rows.length > 0) {
      throw new exception(
        "Já existe solicitação para alterar medida pendente para este envolvido ",
        400
      );
    }
    const trx = await Database.connection("pgMtn").beginTransaction();
    try {
      //Salvar os dados do parecer na tabela pareceres_revertidos
      const dadosUsuario = session.get("currentUserAccount");
      const solicitacaoAlterarMedida = new solicitacaoAlterarMedidaModel();

      solicitacaoAlterarMedida.matricula_solicitante = dadosUsuario.chave;
      solicitacaoAlterarMedida.nome_solicitante = dadosUsuario.nome_usuario;
      solicitacaoAlterarMedida.prefixo_solicitante = dadosUsuario.prefixo;
      solicitacaoAlterarMedida.nome_prefixo_solicitante =
        dadosUsuario.dependencia;
      solicitacaoAlterarMedida.cargo_solicitante = dadosUsuario.nome_funcao;
      solicitacaoAlterarMedida.cd_cargo_solicitante = dadosUsuario.cod_funcao;

      solicitacaoAlterarMedida.id_envolvido = envolvido.id;
      solicitacaoAlterarMedida.id_medida_antiga = envolvido.id_medida;
      solicitacaoAlterarMedida.id_medida_nova = novaMedida;
      solicitacaoAlterarMedida.justificativa = txtJustificativa;

      await solicitacaoAlterarMedida.save(trx);

      //Salvar eventuais anexos da justificativa
      await this._salvarAnexosRequest(
        request,
        tiposAnexo.ALTERACAO_MEDIDA,
        solicitacaoAlterarMedida.id,
        dadosUsuario,
        trx
      );
      await trx.commit();

      return response.created();
    } catch (error) {
      await trx.rollback();
      if (error.message) {
        throw new exception(error.message, error.status);
      } else {
        throw new exception("Falha do sistema tente novamente", 400);
      }
    }
  }

  /**
   *
   *  Retorna ocorrências passíveis de reversão, ou seja, que já foram finalizadas e não possuem solicitação de alteração da medida pendente.
   *
   */

  async ocorrenciasParaReverter({ request, response, session, transform }) {
    const {
      matriculaEnvolvido,
      periodoInicio,
      periodoFim,
      matriculaAnalista,
      nrMtn,
    } = request.allParams();

    const query = envolvidoModel.query();
    query.whereNotNull("respondido_em");
    query.whereDoesntHave("alteracoesMedida", (builder) => {
      builder.where("dt_confirmacao_solicitacao", null);
    });

    if (matriculaEnvolvido) {
      query.where("matricula", matriculaEnvolvido);
    }

    if (periodoInicio && periodoFim) {
      query
        .where("respondido_em", ">=", periodoInicio)
        .where("respondido_em", "<=", periodoFim);
    }

    if (matriculaAnalista) {
      query.where("mat_resp_analise", matriculaAnalista);
    }

    if (nrMtn) {
      query.whereHas("mtn", (builder) => {
        builder.where("nr_mtn", nrMtn);
      });
    }

    const ocorrenciasFinalizadas = await query
      .with("medida")
      .with("mtn")
      .with("anexos", (builder) => {
        builder.with("dadosAnexo");
      })
      .with("alteracoesMedida", (builder) => {
        builder.with("medidaAntiga");
        builder.with("medidaNova");
        builder.with("anexos", (builder) => builder.with("dadosAnexo"));
      })
      .with("recursos", (builder) => {
        builder.with("medida");
        builder.with("anexos", (builder) => builder.with("dadosAnexo"));
        builder.with("anexosParecer", (builder) => builder.with("dadosAnexo"));
      })
      .fetch();

    const transformed = await transform
      .include("anexos,recursos")
      .collection(ocorrenciasFinalizadas.toJSON(), MtnTransformerEnvolvido);

    return response.ok(transformed);
  }

  async getSolicitacoesAlteracaoMedidaPendentes({
    request,
    response,
    session,
    transform,
  }) {
    const solicitacoesPendentes = await envolvidoModel
      .query()
      .whereHas("alteracoesMedida", (builder) => {
        builder.where("dt_confirmacao_solicitacao", null);
      })
      .with("medida")
      .with("anexos", (builder) => {
        builder.with("dadosAnexo");
      })
      .with("alteracoesMedida", (builder) => {
        builder.with("medidaAntiga");
        builder.with("medidaNova");
        builder.with("anexos", (builder) => builder.with("dadosAnexo"));
      })
      .with("mtn")
      .with("recursos", (builder) => {
        builder.with("medida");
        builder.with("anexos", (builder) => builder.with("dadosAnexo"));
        builder.with("anexosParecer", (builder) => builder.with("dadosAnexo"));
      })
      .fetch();

    const transformed = await transform
      .include("anexos,recursos,alteracoesMedida")
      .collection(solicitacoesPendentes.toJSON(), MtnTransformerEnvolvido);

    return response.ok(transformed);
  }

  async lockMtn({ request, response, session, transform }) {
    const { idMtn } = request.allParams();

    const mtn = await this._validaLock(idMtn);

    if (mtn.toJSON().lock) {
      throw new exception("Já existe lock para este protocolo MTN", 400);
    }

    const dadosUsuario = session.get("currentUserAccount");

    const trx = await Database.connection("pgMtn").beginTransaction();
    try {
      await mtn.lock().create(
        {
          matricula_analista: dadosUsuario.chave,
          nome_analista: dadosUsuario.nome_usuario,
        },
        trx
      );
      await trx.commit();
      return response.ok();
    } catch (error) {
      await trx.rollback();
      throw new exception(error, 500);
    }
  }

  async atualizaLock({ request, response, session, transform }) {
    const { idMtn } = request.allParams();
    const trx = await Database.connection("pgMtn").beginTransaction();

    const mtn = await this._validaLock(idMtn);
    const dadosUsuario = session.get("currentUserAccount");
    if (!mtn.lock()) {
      throw new exception(" MTN não possui nenhum lock");
    }
    const dadosAtualizacao = {
      renovado_em: moment(),
    };
    let msg = "";
    if (mtn.toJSON().lock.matricula_analista !== dadosUsuario.chave) {
      dadosAtualizacao.matricula_analista = dadosUsuario.chave;
      dadosAtualizacao.nome_analista = dadosUsuario.nome_usuario;
      msg = "Analista atualizado com sucesso";
    } else {
      msg = "Lock renovado com sucesso";
    }

    try {
      await mtn.lock().transacting(trx).update(dadosAtualizacao);
      await trx.commit();
    } catch (error) {
      await trx.rollback();
      throw new exception(error, 500);
    }
    return response.ok(msg);
  }

  async getLock({ request, response, session, transform }) {
    const { idMtn } = request.allParams();
    const mtn = await this._validaLock(idMtn);

    if (!mtn.toJSON().lock) {
      throw new exception("Protocolo sem nenhum lock", 404);
    }

    const transformed = await transform.item(
      mtn.toJSON().lock,
      LockTransformer
    );

    return response.ok(transformed);
  }

  async liberaLock({ request, response, session, transform }) {
    const { idMtn } = request.allParams();
    const trx = await Database.connection("pgMtn").beginTransaction();

    const mtn = await this._validaLock(idMtn);
    const dadosUsuario = session.get("currentUserAccount");

    if (!mtn.toJSON().lock) {
      throw new exception("Não existe lock para este protocolo MTN", 404);
    }

    if (mtn.toJSON().lock.matricula_analista !== dadosUsuario.chave) {
      throw new exception(
        "Usuário não é o responsável por este protocolo MTN",
        401
      );
    }

    try {
      await lockModel.query().where("id_mtn", idMtn).transacting(trx).delete();
      await trx.commit();
      return response.accepted();
    } catch (error) {
      throw new exception(error, 500);
    }
  }

  async getIdByNrMtn({ request, response }) {
    const { nrMtn } = request.allParams();
    if (!nrMtn) {
      throw new exception("Nr. do MTN é obrigatório", 400);
    }
    const mtn = await mtnModel.findBy("nr_mtn", nrMtn);
    if (!mtn) {
      throw new exception("Mtn não encontrado", 400);
    }
    return response.ok(mtn.id);
  }

  async getIdByOcorrencia({ request, response }) {
    const { nrOcorrencia } = request.allParams();
    if (!nrOcorrencia) {
      throw new exception("Nr. da ocorrência é obrigatório", 400);
    }
    const mtn = await mtnModel.findBy("identificador_operacao", nrOcorrencia);
    if (!mtn) {
      throw new exception("Mtn não encontrado", 400);
    }
    return response.ok(mtn.id);
  }

  async filtrarEnvolvidos({ request, response, transform, session }) {
    /**
     *   Validações:
     *
     *      1 - Caso o prefixo seja informado, a subordinacao deve existir e ser diferente de não se aplica
     *      2 - Caso prefixos seja informado, deve ser um array
     *
     *
     */

    //Strategy onde cada função recebe uma instância da query do MTN e o filtro
    const filtrosComEnvolvidos = {
      // Filtrar pelo período de criação dos envolvidos
      periodo_criacao_envolvido: (query, { periodo_criacao_envolvido }) => {
        query.where(
          "created_at",
          ">=",
          moment(periodo_criacao_envolvido[0])
            .endOf("day")
            .format("YYYY-MM-DD") + " 00:00:00"
        );
        query.where(
          "created_at",
          "<=",
          moment(periodo_criacao_envolvido[1])
            .endOf("day")
            .format("YYYY-MM-DD") + " 23:59:59"
        );
      },

      // Filtrar pelo período de criação do MTN
      periodo_criacao_mtn: (query, { periodo_criacao_mtn }) => {
        query.whereHas("mtn", (builder) => {
          builder
            .where(
              "created_at",
              ">=",
              moment(periodo_criacao_mtn[0]).endOf("day").format("YYYY-MM-DD") +
                " 00:00:00"
            )
            .where(
              "created_at",
              "<=",
              moment(periodo_criacao_mtn[1]).endOf("day").format("YYYY-MM-DD") +
                " 23:59:59"
            );
        });
      },

      // Filtrar pela pendência do parecer da Super Adm
      pendente: (query, { pendente }) => {
        if (pendente === "SIM") {
          //Não respondidos e não tem pendências de recurso e/ou esclarecimento
          query.whereNull("respondido_em");
          query.whereDoesntHave("recursos", (builder) => {
            builder.whereNull("respondido_em");
            builder.whereNull("revelia_em");
          });
          query.whereDoesntHave("esclarecimentos", (builder) => {
            builder.whereNull("respondido_em");
            builder.whereNull("revelia_em");
          });
        } else if (pendente === "NAO") {
          query.where((builder) => {
            builder.orWhereNotNull("respondido_em"); //Finalizados
            // Ou possui recusos pendentes
            builder.orWhereHas("recursos", (builder) => {
              builder.whereNull("respondido_em");
              builder.whereNull("revelia_em");
            });
            // Ou possui esclarecimentos pendentes
            builder.orWhereHas("esclarecimentos", (builder) => {
              builder.whereNull("respondido_em");
              builder.whereNull("revelia_em");
            });
          });
        }
      },

      periodo_parecer: (query, { periodo_parecer }) => {
        query.where(
          "respondido_em",
          ">=",
          moment(periodo_parecer[0]).endOf("day").format("YYYY-MM-DD") +
            " 23:59:59"
        );
        query.where(
          "respondido_em",
          "<=",
          moment(periodo_parecer[1]).endOf("day").format("YYYY-MM-DD") +
            " 23:59:59"
        );
      },

      //Filtrar pela medida aplicada
      medida: (query, { medida }) => {
        query.whereIn("id_medida", medida);
      },

      status: (query, { status }) => {
        query.whereHas("mtn", (builder) => {
          builder.whereIn("id_status", status);
        });
      },

      //Filtrar pela matrícula dos envolvidos
      envolvido: (query, { envolvido }) => {
        query.where("matricula", "ilike", "%" + envolvido + "%");
      },

      //Filtrar pelo prefixo da ocorrência ou suas subordinadas
      prefixos: (query, { prefixos, subordinacao }) => {
        if (subordinacao === "subordinadas") {
          query.whereHas("mtn", (builder) => {
            builder.where((builder) => {
              builder
                .whereIn("prefixo_super_comercial", prefixos)
                .orWhereIn("prefixo_super_negocial", prefixos)
                .orWhereIn("prefixo_unidade_estrategica", prefixos);
            });
          });
        } else if (subordinacao === "prefixos") {
          query.whereHas("mtn", (builder) => {
            builder.whereIn("prefixo_ocorrencia", prefixos);
          });
        }
      },

      visao: (query, { visao }) => {
        query.whereHas("mtn", (builder) => {
          builder.whereIn("id_visao", visao);
        });
      },
    };

    const filtrosSemEnvolvidos = {
      periodo_criacao_mtn: (query, { periodo_criacao_mtn }) => {
        query
          .where(
            "created_at",
            ">=",
            moment(periodo_criacao_mtn[0]).endOf("day").format("YYYY-MM-DD") +
              " 23:59:59"
          )
          .where(
            "created_at",
            "<=",
            moment(periodo_criacao_mtn[1]).endOf("day").format("YYYY-MM-DD") +
              " 23:59:59"
          );
      },

      prefixos: (query, { prefixos, subordinacao }) => {
        if (subordinacao === "subordinadas") {
          query.where((builder) => {
            builder
              .whereIn("prefixo_super_comercial", prefixos)
              .orWhereIn("prefixo_super_negocial", prefixos)
              .orWhereIn("prefixo_unidade_estrategica", prefixos);
          });
        } else if (subordinacao === "prefixos") {
          query.whereIn("prefixo_ocorrencia", prefixos);
        }
      },

      visao: (query, { visao }) => {
        query.whereIn("id_visao", visao);
      },

      pendente: (query, { pendente }) => {
        if (pendente === "SIM") {
          query.whereDoesntHave("fechadoSemEnvolvido");
        } else if (pendente === "NAO") {
          query.whereHas("fechadoSemEnvolvido");
        }
      },
    };

    const { chave } = session.get("currentUserAccount");
    const params = request.allParams();
    const filtrosRecebidos = JSON.parse(params.filtros);
    const pagination = JSON.parse(params.pagination);
    const queryComEnvolvidos = envolvidoModel.query();
    const querySemEnvolvidos = mtnModel.query().whereDoesntHave("envolvidos");

    for (const filtro in filtrosRecebidos) {
      if (filtrosComEnvolvidos[filtro]) {
        filtrosComEnvolvidos[filtro](queryComEnvolvidos, filtrosRecebidos);
      }

      if (filtrosSemEnvolvidos[filtro]) {
        filtrosSemEnvolvidos[filtro](querySemEnvolvidos, filtrosRecebidos);
      }
    }

    const envolvidos = await queryComEnvolvidos
      .with("mtn", (builder) => builder.with("visao"))
      .with("medida")
      .clone()
      .paginate(pagination.page, pagination.pageSize);

    await this._filtrado({
      filtros: filtrosRecebidos,
      query: queryComEnvolvidos.clone().toString(),
      matricula: chave,
      visao: "MTN - Com Envolvidos",
    });

    await this._filtrado({
      filtros: filtrosRecebidos,
      query: querySemEnvolvidos.clone().toString(),
      matricula: chave,
      visao: "MTN - Sem Envolvidos",
    });

    const queryPendentes = queryComEnvolvidos.clone();
    const queryFinalizados = queryComEnvolvidos.clone();
    filtrosComEnvolvidos.pendente(queryPendentes, { pendente: "SIM" });
    filtrosComEnvolvidos.pendente(queryFinalizados, { pendente: "NAO" });
    const qtdPendentes = await queryPendentes.count();
    const qtdFinalizados = await queryFinalizados.count();

    const finalizadosSemEnvolvidos = await querySemEnvolvidos
      .clone()
      .whereHas("fechadoSemEnvolvido")
      .where("id_status", mtnStatus.FINALIZADO)
      .count();

    const pendentesSemEnvolvidos = await querySemEnvolvidos
      .clone()
      .whereDoesntHave("envolvidos")
      .where("id_status", "<>", mtnStatus.FINALIZADO)
      .count();

    const transformed = await transform.collection(
      envolvidos.toJSON().data,
      "Mtn/MtnTransformerEnvolvido.filtrados"
    );

    const desconsiderarFinalizadosSemEnvolvidos =
      Object.keys(filtrosRecebidos).filter((filtro) =>
        ["periodo_parecer", "medida", "envolvido"].includes(filtro)
      ).length > 0;

    return response.ok({
      results: transformed,
      pendentesSemEnvolvidos: desconsiderarFinalizadosSemEnvolvidos
        ? 0
        : pendentesSemEnvolvidos[0].count,
      finalizadosSemEnvolvidos: desconsiderarFinalizadosSemEnvolvidos
        ? 0
        : finalizadosSemEnvolvidos[0].count,
      qtdPendentes: qtdPendentes[0].count,
      qtdFinalizados: qtdFinalizados[0].count,
      totalCount: envolvidos.toJSON().total,
      currentPage: envolvidos.toJSON().page,
    });
  }

  async filtrarAcoes({ request, response, transform, session }) {
    /**
     *   Validações:
     *
     *      1 - Caso o prefixo seja informado, a subordinacao deve existir e ser diferente de não se aplica
     *      2 - Caso prefixos seja informado, deve ser um array
     *
     *
     */

    //Strategy onde cada função recebe uma instância da query do MTN e o filtro
    const aplicarFiltro = {
      acoes: (query, { acoes }) => {
        query.whereIn("id_acao", acoes);
      },
      periodo_acoes: (query, { periodo_acoes }) => {
        query.where(
          "created_at",
          ">=",
          moment(periodo_acoes[0]).endOf("day").format("YYYY-MM-DD") +
            " 00:00:00"
        );
        query.where(
          "created_at",
          "<=",
          moment(periodo_acoes[1]).endOf("day").format("YYYY-MM-DD") +
            " 23:59:59"
        );
      },
      envolvido: (query, { envolvido }) => {
        query.whereHas("envolvido", (builder) => {
          builder.where("matricula", envolvido);
        });
      },

      assessor: (query, { assessor }) => {
        query.where("mat_resp_acao", assessor);
      },

      prefixos: (query, { prefixos, subordinacao }) => {
        if (subordinacao === "subordinadas") {
          query.whereHas("envolvido", (builder) => {
            builder.whereHas("mtn", (builder) => {
              builder.where((builder) => {
                builder
                  .whereIn("prefixo_super_comercial", prefixos)
                  .orWhereIn("prefixo_super_negocial", prefixos)
                  .orWhereIn("prefixo_unidade_estrategica", prefixos);
              });
            });
          });
        } else if (subordinacao === "prefixos") {
          query.whereHas("envolvido", (builder) => {
            builder.whereHas("mtn", (builder) => {
              builder.whereIn("prefixo_ocorrencia", prefixos);
            });
          });
        }
      },

      visao: (query, { visao }) => {
        query.whereHas("envolvido", (builder) => {
          builder.whereHas("mtn", (builder) => {
            builder.whereIn("id_visao", visao);
          });
        });
      },
    };

    const { chave } = session.get("currentUserAccount");
    const params = request.allParams();
    const filtrosRecebidos = JSON.parse(params.filtros);
    const pagination = JSON.parse(params.pagination);

    const query = timelineModel.query();

    for (const filtro in filtrosRecebidos) {
      if (aplicarFiltro[filtro]) {
        aplicarFiltro[filtro](query, filtrosRecebidos);
      }
    }

    const acoes = await query
      .with("envolvido", (builder) => {
        builder
          .with("mtn", (builder) => {
            builder.with("visao");
          })
          .with("medida");
      })
      .with("acao")
      .clone()
      .paginate(pagination.page, pagination.pageSize);

    await this._filtrado({
      filtros: filtrosRecebidos,
      query: query.clone().toString(),
      matricula: chave,
      visao: "ASSESSORES",
    });

    const queryResumoAcoes = query.clone();

    const resumo = await queryResumoAcoes
      .select("id_acao")
      .count("* as total")
      .groupBy("id_acao");
    for (const index in resumo) {
      const dbAcao = await acoesModel.find(resumo[index].id_acao);
      resumo[index] = {
        ...resumo[index],
        tipo: dbAcao.tipo,
        display: dbAcao.nome_filtro,
      };
    }
    const transformed = await transform.collection(
      acoes.toJSON().data,
      "Mtn/MtnTimelineTransformer.filtrados"
    );

    return response.ok({
      results: transformed,
      resumo,
      totalCount: acoes.toJSON().total,
      currentPage: acoes.toJSON().page,
    });
  }

  async getConfigPrazos({ request, response }) {
    const prazos = await prazosModel.query().fetch();
    const config = await configPrazosModel.query().last();
    return response.ok({
      prazos,
      ultimaAlteracao: config ? config.config : {},
    });
  }

  async atualizarConfigPrazos({ request, response, session }) {
    const { prazos } = request.allParams();
    const { justificativa, ...datas } = prazos;
    const dadosUsuario = session.get("currentUserAccount");

    const newConfig = new configPrazosModel();
    newConfig.config = datas;
    newConfig.justificativa = justificativa;
    newConfig.matricula = dadosUsuario.chave;
    newConfig.nome = dadosUsuario.nome_usuario;
    await newConfig.save();

    return response.ok();
  }

  /* ----- Private Methods ----- */

  async _filtrado(dadosFiltragem) {
    const filtragem = new filtragemModel();
    filtragem.txt_query = dadosFiltragem.query;
    filtragem.filtros = JSON.stringify(dadosFiltragem.filtros);
    filtragem.matricula = dadosFiltragem.matricula;
    filtragem.visao = dadosFiltragem.visao;
    await filtragem.save();
  }

  async _validaLock(idMtn) {
    if (!idMtn) {
      throw new exception("É obrigatório informar o MTN", 400);
    }

    const mtn = await mtnModel.find(idMtn);

    if (!mtn) {
      throw new exception("Protocolo MTN inválido", 404);
    }

    await mtn.load("lock");
    return mtn;
  }

  async _getInteracoesPendentes(matricula) {
    const questionariosDB = await getRespostas(matricula, true, false);

    for (let questionario of questionariosDB) {
      if (!questionario.id_visao) {
        questionario.visao = "Visão não informada";
        continue;
      }

      const visao = await visaoModel.find(questionario.id_visao);
      questionario.visao = visao.desc_visao;
    }

    const questionarios = questionariosDB.map((questionario) => {
      return {
        id: questionario.id_resposta,
        tipoDisplay: "Questionário",
        tipo: "questionario",
        solicitante: `Super Adm`,
        dataNotificacao: questionario.ts_envio,
        visao: questionario.visao,
        prazo: questionario.qtd_dias_pendentes,
      };
    });

    const esclarecimentosDB = await esclarecimentoModel
      .query()
      .whereHas("envolvido", (builder) => {
        builder.where("matricula", matricula);
        builder.with("mtn");
      })
      .whereNull("respondido_em")
      .whereNull("revelia_em")
      .with("envolvido", (builder) => {
        builder.with("mtn", (builder) => {
          builder.with("visao");
        });
      })
      .fetch();

    const esclarecimentos = esclarecimentosDB.toJSON().map((esclarecimento) => {
      return {
        id: esclarecimento.envolvido.id_mtn,
        tipoDisplay: "Esclarecimento",
        tipo: "esclarecimento",
        solicitante: `${esclarecimento.cd_prefixo_solicitante} - ${esclarecimento.nome_prefixo_solicitante}`,
        dataNotificacao: esclarecimento.created_at,
        visao: esclarecimento.envolvido.mtn.visao.desc_visao,
        prazo: esclarecimento.qtd_dias_trabalhados,
      };
    });

    const recursosDB = await recursoModel
      .query()
      .whereHas("envolvido", (builder) => {
        builder.where("matricula", matricula);
        builder.with("mtn");
      })
      .whereNull("respondido_em")
      .whereNull("revelia_em")
      .with("envolvido", (builder) => {
        builder.with("mtn", (builder) => {
          builder.with("visao");
        });
      })
      .fetch();

    const recursos = recursosDB.toJSON().map((recurso) => {
      return {
        id: recurso.envolvido.mtn.id,
        tipoDisplay: "Recurso",
        tipo: "recurso",
        solicitante: `${recurso.cd_prefixo_resp_analise} - ${recurso.nome_prefixo_resp_analise}`,
        dataNotificacao: recurso.created_at,
        visao: recurso.envolvido.mtn.visao.desc_visao,
        prazo: recurso.qtd_dias_trabalhados,
      };
    });
    return [...questionarios, ...esclarecimentos, ...recursos];
  }

  /**
   *
   *  Salva os arquivos recebidos no request.
   *
   * @param {*} request Requisição contendo os arquivos a serem salvos
   * @param {*} tipoAnexo Tipo do anexo a ser salvo. Os tipos permitidos estão
   * @param {*} idVinculo
   * @param {*} dadosUsuario
   * @param {object} trx
   *
   */
  async _salvarAnexosRequest(request, tipoAnexo, idVinculo, dadosUsuario, trx) {
    const arquivos = this._getFiles(request);

    const idAnexosCriados = [];

    for (let arquivo of arquivos) {
      const dadosArquivo = {
        filePath: Helpers.appRoot("/storage/mtn"),
        fileName: `${md5(arquivo.clientName + moment().toString())}.${
          arquivo.extname
        }`,
        fileSize: arquivo.size,
        fileExtension: arquivo.extname,
        originalName: arquivo.clientName,
        mimeType: `${arquivo.type}/${arquivo.subtype}`,
      };

      var novoAnexo = fs.readFileSync(arquivo.tmpPath);

      // Converte o arquivo para base64
      let base64 = new Buffer.from(novoAnexo).toString("base64");

      //Criação do Model
      const newAnexo = new anexoModel();
      newAnexo.nome_arquivo = dadosArquivo.fileName;
      newAnexo.tipo = tipoAnexo;
      newAnexo.incluido_por = dadosUsuario.chave;
      newAnexo.base64 = base64;
      newAnexo.extensao = dadosArquivo.fileExtension;
      newAnexo.mime_type = dadosArquivo.mimeType;
      newAnexo.nome_original = dadosArquivo.originalName;

      await newAnexo.save(trx);
      idAnexosCriados.push(newAnexo.id);

      switch (tipoAnexo) {
        case tiposAnexo.PARECER:
          const newEnvolvidoAnexo = new envolvidoAnexoModel();
          newEnvolvidoAnexo.id_envolvido = idVinculo;
          newEnvolvidoAnexo.id_anexo = newAnexo.id;
          await newEnvolvidoAnexo.save(trx);
          break;

        case tiposAnexo.ESCLARECIMENTO:
          const newEsclarecimentoAnexo = new esclarecimentosAnexoModel();
          newEsclarecimentoAnexo.id_esclarecimento = idVinculo;
          newEsclarecimentoAnexo.id_anexo = newAnexo.id;
          await newEsclarecimentoAnexo.save(trx);
          break;

        case tiposAnexo.PARECER_RECURSO:
          //Criar o vínculo do parecer_recurso com o anexos
          const newParecerRecursoAnexo = new parecerRecursoAnexoModel();
          newParecerRecursoAnexo.id_anexo = newAnexo.id;
          newParecerRecursoAnexo.id_recurso = idVinculo;
          await newParecerRecursoAnexo.save(trx);
          break;

        case tiposAnexo.RECURSO:
          //Criar o vínculo do parecer_recurso com o anexos
          const newRecursoAnexo = new recursoAnexoModel();
          newRecursoAnexo.id_anexo = newAnexo.id;
          newRecursoAnexo.id_recurso = idVinculo;
          await newRecursoAnexo.save(trx);
          break;

        case tiposAnexo.ALTERACAO_MEDIDA:
          //Criar o vínculo do pareceres_revertidos com os anexos
          const newAlterarMedida = new alterarMedidaAnexo();
          newAlterarMedida.id_anexo = newAnexo.id;
          newAlterarMedida.id_alteracao_medida = idVinculo;
          await newAlterarMedida.save(trx);
          break;

        case tiposAnexo.MTN_FECHADO_SEM_ENVOLVIDOS:
          const mtnFechadosSemEnvolvidosAnexos =
            new mtnFechadosSemEnvolvidosAnexosModel();
          mtnFechadosSemEnvolvidosAnexos.id_anexo = newAnexo.id;
          mtnFechadosSemEnvolvidosAnexos.id_mtn_fechado_sem_envolvido =
            idVinculo;
          await mtnFechadosSemEnvolvidosAnexos.save(trx);
          break;

        case null:
          break;

        default:
          throw new exception(
            "Os tipos de anexo devem ser definidos no arquivo app/Commons/Constants informar o tipo de MTN",
            500
          );
          break;
      }
    }

    return idAnexosCriados;
  }

  async _getEnvolvimentos(pendentes, matricula) {
    let query = envolvidoModel.query();
    query
      .where("matricula", matricula)
      .where("versionado", false)
      .whereHas("mtn", (builder) => {
        if (pendentes) {
          builder.where("id_status", "<>", mtnStatus.FINALIZADO);
        } else {
          builder.where("id_status", mtnStatus.FINALIZADO);
        }
      })
      .with("mtn", (builder) => {
        builder.with("visao");
        builder.with("status");
      });
    query.with("esclarecimentos", (builder) => {
      builder.where("respondido_em", null);
    });
    let envolvimentos = await query.fetch();

    return envolvimentos.toJSON();
  }

  async _moveAnexosToRecurso(idEnvolvido, idRecurso, anexos, trx) {
    const arrayIds = anexos.map((anexo) => anexo.id_anexo);
    await envolvidoAnexoModel
      .query()
      .transacting(trx)
      .whereIn("id_anexo", arrayIds)
      .where("id_envolvido", idEnvolvido)
      .delete();
    await parecerRecursoAnexoModel.createMany(
      arrayIds.map((id) => {
        return { id_anexo: id, id_recurso: idRecurso };
      }),
      trx
    );
  }

  async _calcStatusMtn(acao, mtn, idEnvolvido) {
    if (acao !== acoes.FINALIZAR_ANALISE) {
      return mtnStatus.EM_ANALISE;
    }

    //Verifica se algum dos outros envolvidos envolvido ainda está pendente de análise
    let envolvidosPendentes = mtn.toJSON().envolvidos.filter((envolvido) => {
      return (
        envolvido.respondido_em === null &&
        envolvido.id !== parseInt(idEnvolvido)
      );
    });

    if (acao === acoes.FINALIZAR_ANALISE && envolvidosPendentes.length === 0) {
      return mtnStatus.FINALIZADO;
    }

    return mtnStatus.EM_ANALISE;
  }

  async _returnMeuMtn(idMtn, matricula, idEnvolvido) {
    const dadosMtn = await mtnModel
      .query()
      .where("id", idMtn)
      .with("visao")
      .with("status")
      .with("envolvidos", (builder) => {
        builder.where("matricula", matricula);
        if (idEnvolvido) {
          builder.where("id", idEnvolvido);
        }
        builder.with("medida");
        builder.with("recursos", (builder) => {
          builder.with("medida");
          builder.with("anexos", (builder) => builder.with("dadosAnexo"));
          builder.with("anexosParecer", (builder) =>
            builder.with("dadosAnexo")
          );
        });
        builder.with("esclarecimentos", (builder) => {
          builder.with("anexos", (builder) => {
            builder.with("dadosAnexo");
          });
          builder.orderBy("created_at", "desc");
        });
        builder.with("anexos", (builder) => builder.with("dadosAnexo"));
        builder.with("timeline", (builder) => {
          builder.whereHas("acao", (builder) => {
            builder.where("mostrar_envolvido", true);
          });
          builder.with("acao");
          builder.orderBy("created_at");
        });
        builder.orderBy("created_at", "desc");
      })
      .whereHas("envolvidos", (builder) => {
        builder.where("matricula", matricula);
      })
      .orderBy("id", "asc")
      .first();

    return dadosMtn;
  }

  // Função que atualiza o status, conforme necessário e insere entrada na timeline. Além disso atualiza a instância do envolvido
  async _executarAcao(acao, dadosRespAcao, idEnvolvido, trx) {
    //Calcula o próximo status
    const mtn = await mtnModel
      .query()
      .whereHas("envolvidos", (builder) => {
        builder.where("id", idEnvolvido);
      })
      .with("envolvidos", (builder) => {
        builder.with("esclarecimentos");
      })
      .first();

    //No caso de finalização da análise, deve-se finalizar a revelia todos os esclarecimentos solicitados
    if (
      acao === acoes.FINALIZAR_ANALISE ||
      acao === acoes.SALVAR_PARECER_RECURSO
    ) {
      await esclarecimentoModel
        .query()
        .where("id_envolvido", idEnvolvido)
        .whereNull("respondido_em")
        .whereNull("revelia_em")
        .transacting(trx)
        .update({
          revelia_em: moment(),
          txt_resposta: msgsRevelia.finalizado,
        });
    }

    // Como a análise está sendo finalizada, deve-se fechar à revelia aqueles recursos que ainda estão pendentes.
    if (acao === acoes.FINALIZAR_ANALISE) {
      await recursoModel
        .query()
        .where("id_envolvido", idEnvolvido)
        .whereNull("respondido_em")
        .whereNull("revelia_em")
        .transacting(trx)
        .update({
          revelia_em: moment(),
          txt_recurso: msgsRevelia.recurso,
        });
    }

    const novoStatusMtn = await this._calcStatusMtn(acao, mtn, idEnvolvido);
    mtn.id_status = novoStatusMtn;
    // Caso esteja finalizando a análise, é necessário remover eventuais avocados
    if (novoStatusMtn === mtnStatus.FINALIZADO) {
      await limparLocksMtn(mtn.id);
    }

    await mtn.save(trx);

    const tipoDaNotificacao = this._getTipoNotificacao(acao);
    const dadosNotificacao = await insereTimeline(
      idEnvolvido,
      acao,
      dadosRespAcao,
      tipoDaNotificacao,
      false,
      trx
    );
    return dadosNotificacao;
  }

  /**
   *   Função que retorna os arquivos. É necessário pois quando recebe um arquivo fica em um local diferente de quando recebe vários arquivos.
   * @param {*} request
   */

  _getFiles(request) {
    let arquivos = [];

    //Caso não existam arquivos
    if (request.file("files")) {
      //Caso múltiplos arquivos
      arquivos = request.file("files").files;
      //Caso único arquivo
      if (!arquivos) {
        arquivos = [request.file("files")];
      }
      return arquivos;
    }

    if (request.files("files")) {
      let arquivosTemp = request.files("files");
      for (let chave in arquivosTemp) {
        arquivos.push(arquivosTemp[chave]);
      }
      return arquivos;
    }

    return arquivos;
  }

  _getTipoNotificacao(acao) {
    switch (acao) {
      case acoes.CRIACAO:
        return { id: "CRIACAO", template: "Mtn/Interacao" };
      case acoes.SOLICITA_ESCLARECIMENTO:
        return { id: "SOLICITA_ESCLARECIMENTO", template: "Mtn/Interacao" };
      case acoes.RESPONDE_ESCLARECIMENTO:
        return { id: "RESPONDE_ESCLARECIMENTO", template: "Mtn/Interacao" };
      case acoes.FINALIZAR_ANALISE:
        return { id: "FINALIZAR_ANALISE", template: "Mtn/Interacao" };
      case acoes.PARECER:
        return { id: "PARECER", template: "Mtn/Interacao" };
      case acoes.SALVAR_PARECER_RECURSO:
        return { id: "SALVAR_PARECER_RECURSO", template: "Mtn/AlertaEtico" };
      case acoes.RESPONDER_RECURSO:
        return { id: "RESPONDER_RECURSO", template: "Mtn/Interacao" };
      case acoes.REVELIA_ESCLARECIMENTO:
        return { id: "REVELIA_ESCLARECIMENTO", template: "Mtn/Interacao" };
      case acoes.REVELIA_RECURSO:
        return { id: "REVELIA_RECURSO", template: "Mtn/Interacao" };
      case acoes.SOLICITA_REVERSAO:
        return { id: "SOLICITA_REVERSAO", template: "Mtn/Interacao" };
      case acoes.CONFIRMA_REVERSAO:
        return { id: "CONFIRMA_REVERSAO", template: "Mtn/Interacao" };
      case acoes.ESCLARECIMENTO_INICIAL:
        return { id: "ESCLARECIMENTO_INICIAL", template: "Mtn/Interacao" };
      case acoes.CONFIRMA_ALTERACAO_MEDIDA:
        return { id: "CONFIRMA_ALTERACAO_MEDIDA", template: "Mtn/Interacao" };
      default:
        tiposNotificacao.INTERACAO;
    }
  }

  _isStatusValido(tipo) {
    if (tipo === EM_ANDAMENTO || tipo === FINALIZADOS) {
      return true;
    }
    return false;
  }

  async painelDicoi({ request, response, transform }) {
    const { periodo, prazo } = request.allParams();

    let qtdes = await qtdeTotais(prazo, periodo);
    const percentualForaPrazo =
      (qtdes.qtd_fora_prazo / qtdes.qtd_analises) * 100;
    qtdes.percentualForaPrazo = percentualForaPrazo;
    const qtdeTransformed = await transform.collection(
      [qtdes],
      QuantidadesTransformer
    );
    const quantidades = qtdeTransformed[0];

    const analisesForaPrazo = await listaForaPrazo(prazo, periodo);
    const analisesTransformed = await transform.collection(
      analisesForaPrazo,
      ListaPainelDicoiTransformer
    );
    const analises = [...analisesTransformed];

    response.ok({ quantidades, analises });
  }

  async peopleAnalitics({ request, response, transform }) {
    const { idEnvolvido } = request.allParams();

    const analitics = await Analitics.query()
      .where("id_envolvido", idEnvolvido)
      .fetch();

    const analiticsTransformed = await transform.collection(
      analitics,
      AnaliticsTransformer
    );
    const peopleAnalitics = analiticsTransformed;

    response.ok(peopleAnalitics);
  }

  async questionarioView({ request, response, transform }) {
    const { idEnvolvido, idMtn } = request.allParams();
    const envolvido = typeof idEnvolvido === "string" ? null : idEnvolvido;

    const quest = await QuestView.query()
      .where(function () {
        this.where("id_envolvido", parseInt(idEnvolvido)).orWhere(
          "id_envolvido",
          null
        );
      })
      .where("id_mtn", parseInt(idMtn))
      .fetch();

    const questTransformed = await transform.collection(
      quest,
      QuestViewTransformer
    );
    const questionarioView = questTransformed;

    response.ok(questionarioView);
  }

  async notificacoesAnalise({ request, response, transform }) {
    const { idEnvolvido } = request.allParams();

    const notif = await Notificacao.query()
      .where("id_envolvido", idEnvolvido)
      .with("envolvido", (builder) => {
        builder.with("mtn");
      })
      .fetch();

    const notifTransformed = await transform.collection(
      notif.toJSON(),
      NotificacoesAnaliseTransformer
    );
    const notificacoes = notifTransformed;

    response.ok(notificacoes);
  }

  // notas internas
  async novaNotaInterna({ request, response, session }) {
    const { notaInterna } = request.allParams();
    const usuarioLogado = session.get("currentUserAccount");
    const ucNovaNotaInterna = new UCNovaNotaInterna({
      repository: {
        novaNota: new NotasInternasRepository(),
        envolvido: new EnvolvidoRepository(),
      },
      functions: { hasPermission },
    });
    const { error, payload } = await ucNovaNotaInterna.run(
      notaInterna,
      usuarioLogado
    );
    handleAbstractUserCaseError(error);

    response.ok(payload);
  }

  async getNotasByEnvolvido({ request, response, session }) {
    const { idEnvolvido } = request.allParams();
    const usuarioLogado = session.get("currentUserAccount");
    const ucNotasInternas = new UCNotasInternas({
      repository: {
        notaInterna: new NotasInternasRepository(),
        envolvido: new EnvolvidoRepository(),
      },
      functions: { hasPermission },
    });
    const { error, payload } = await ucNotasInternas.run(
      parseInt(idEnvolvido),
      usuarioLogado
    );
    handleAbstractUserCaseError(error);

    response.ok(payload);
  }

  async registrarLeituraNotaInterna({ request, response, session }) {
    const { leituraNota } = request.allParams();
    const usuarioLogado = session.get("currentUserAccount");
    const ucLeituraNotaInterna = new UCLeituraNotaInterna({
      repository: {
        notaInterna: new NotasInternasRepository(),
        envolvido: new EnvolvidoRepository(),
      },
      functions: { hasPermission },
    });
    const { error, payload } = await ucLeituraNotaInterna.run(
      leituraNota.idEnvolvido,
      leituraNota.idNotaInterna,
      usuarioLogado
    );
    handleAbstractUserCaseError(error);

    response.ok(payload);
  }
  // fim do notas internas
}

module.exports = MtnController;
