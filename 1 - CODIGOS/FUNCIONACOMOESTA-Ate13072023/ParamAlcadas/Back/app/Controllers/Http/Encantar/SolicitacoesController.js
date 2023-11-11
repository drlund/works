"use strict";

//BIBLIOTECAS GLOBAIS
const moment = use("moment");
const exception = use("App/Exceptions/Handler");
const Database = use("Database");
const hasPermission = use("App/Commons/HasPermission");
const Helpers = use("Helpers");
const Drive = use("Drive");
var fs = require("fs");
//CONSTANTES
const { EncantarConsts } = use("Constants");
const {
  STATUS_SOLICITACAO,
  CAMINHO_COMMONS,
  CAMINHO_MODELS,
  ACOES_HISTORICO_SOLICITACAO,
  TIPOS_NOTIFICACAO,
  TRATAMENTOS_DEVOLUCAO,
  LOCAL_ENTREGA,
} = EncantarConsts;
//FUNÇÕES AUXILIARES
const { getFilesFromRequest } = use("App/Commons/FileUtils");

// SERVICES

/** @type {typeof import('../../../Commons/Arh/getHierarquiaDependencia')} */
const getHierarquiaDependencia = use(
  "App/Commons/Arh/getHierarquiaDependencia"
);
/** @type {typeof import('../../../Commons/JsonParseObjeto')} */
const jsonParseObjeto = use("App/Commons/JsonParseObjeto");

/** @type {typeof import('../../../Commons/Encantar/Solicitacoes/parseParamsAvancarFluxo')} */
const parseParamsAvancarFluxo = use(
  `${CAMINHO_COMMONS}/Solicitacoes/parseParamsAvancarFluxo`
);
/** @type {typeof import('../../../Commons/Encantar/Solicitacoes/isUltimoFluxo')} */
const isUltimoDoFluxo = use(`${CAMINHO_COMMONS}/Solicitacoes/isUltimoFluxo`);
/** @type {typeof import('../../../Commons/Encantar/Solicitacoes/getDadosClientesEncantar')} */
const getDadosClientesEncantar = use(
  `${CAMINHO_COMMONS}/getDadosClientesEncantar`
);

/** @type {typeof import('../../../Commons/Encantar/Solicitacoes/getSolicitacoesParaRecebimento')} */
const getSolicitacoesPendentesParaRecebimentoPrefixo = use(
  `${CAMINHO_COMMONS}/Entrega/getSolicitacoesPendentesParaRecebimentoPrefixo`
);

/** @type {typeof import('../../../Commons/Encantar/Solicitacoes/getSolicitacoesParaRecebimento')} */
const getSolicitacoesMeuPrefixo = use(
  `${CAMINHO_COMMONS}/Solicitacoes/getSolicitacoesMeuPrefixo`
);

/** @type {typeof import('../../../Commons/Encantar/Entrega/registrarEnvioSolicitacao')} */
const registrarEnvioSolicitacao = use(
  `${CAMINHO_COMMONS}/Entrega/registrarEnvioSolicitacao`
);
/** @type {typeof import('../../../Commons/Encantar/Entrega/registrarRecebimentoSolicitacao')} */
const registrarRecebimentoSolicitacao = use(
  `${CAMINHO_COMMONS}/Entrega/registrarRecebimentoSolicitacao`
);
/** @type {typeof import('../../../Commons/Encantar/Entrega/removerBrindesSelecionadosDoEstoque')} */
const removerBrindesSelecionadosDoEstoque = use(
  `${CAMINHO_COMMONS}/Entrega/removerBrindesSelecionadosDoEstoque`
);

/** @type {typeof import('../../../Commons/Encantar/Solicitacoes/getSolicitacoesPendentesParaEnvio')} */
const getSolicitacoesPendentesParaEnvio = use(
  `${CAMINHO_COMMONS}/Entrega/getSolicitacoesPendentesParaEnvio`
);

/** @type {typeof import('../../../Commons/Encantar/Solicitacoes/getSolicitacoesPendentesEntregaCliente')} */
const getSolicitacoesPendentesEntregaCliente = use(
  `${CAMINHO_COMMONS}/Entrega/getSolicitacoesPendentesEntregaCliente`
);

/** @type {typeof import('../../../Commons/Encantar/Solicitacoes/getAvancarFluxoFormParams')} */
const reservarBrindes = use(`${CAMINHO_COMMONS}/Estoque/reservarBrindes`);

/** @type {typeof import('../../../Commons/Encantar/Solicitacoes/getCapacitacaoVideos')} */
const getCapacitacaoVideos = use(
  `${CAMINHO_COMMONS}/Solicitacoes/getCapacitacaoVideos`
);
/** @type {typeof import('../../../Commons/Encantar/Solicitacoes/verificarPermissaoRegistroReacao')} */
const verificarPermissaoRegistroReacao = use(
  `${CAMINHO_COMMONS}/Solicitacoes/verificarPermissaoRegistroReacao`
);
/** @type {typeof import('../../../Commons/Encantar/Solicitacoes/verificarPermissaoRegistroReacao')} */
const verificarPermissaoIncluirSolicitacao = use(
  `${CAMINHO_COMMONS}/Solicitacoes/verificarPermissaoIncluirSolicitacao`
);
const getSolicitacoesParaReacao = use(
  `${CAMINHO_COMMONS}/Solicitacoes/getSolicitacoesParaReacao`
);

const getMinhasSolicitacoesParaReacao = use(
  `${CAMINHO_COMMONS}/Solicitacoes/getMinhasSolicitacoesParaReacao`
);
/** @type {typeof import('../../../Commons/Encantar/Solicitacoes/getFluxoAtualPorSolicitacao')} */
const getFluxoAtualPorSolicitacao = use(
  `${CAMINHO_COMMONS}/Solicitacoes/getFluxoAtualPorSolicitacao`
);
/** @type {typeof import('../../../Commons/Encantar/Solicitacoes/atualizarFluxoAprovacao')} */
const atualizarFluxoAprovacao = use(
  `${CAMINHO_COMMONS}/Solicitacoes/atualizarFluxoAprovacao`
);
/** @type {typeof import('../../../Commons/Encantar/Solicitacoes/usuarioTemPermissaoNoFluxo')} */
const usuarioTemPermissaoNoFluxo = use(
  `${CAMINHO_COMMONS}/Solicitacoes/usuarioTemPermissaoNoFluxo`
);

/** @type {typeof import('../../../Commons/Encantar/Solicitacoes/getPrefixosComAcessoParaAprovar')} */
const getPrefixosComAcessoParaAprovar = use(
  `${CAMINHO_COMMONS}/Solicitacoes/getPrefixosComAcessoParaAprovar`
);

/** @type {typeof import('../../../Commons/Encantar/Solicitacoes/avancarSolicitacaoNoFluxo')} */
const avancarSolicitacaoNoFluxo = use(
  `${CAMINHO_COMMONS}/Solicitacoes/avancarSolicitacaoNoFluxo`
);

/** @type {typeof import('../../../Commons/Encantar/Solicitacoes/isSolicitacaoParaReacao')} */
const isSolicitacaoParaReacao = use(
  `${CAMINHO_COMMONS}/Solicitacoes/isSolicitacaoParaReacao`
);

/** @type {typeof import('../../../Commons/Encantar/Solicitacoes/incluirHistoricoSolicitacao')} */
const incluirHistoricoSolicitacao = use(
  `${CAMINHO_COMMONS}/Solicitacoes/incluirHistoricoSolicitacao`
);

/** @type {typeof import('../../../Commons/Encantar/Solicitacoes/getBrindesByGestor')} */
const getBrindesByGestor = use(`${CAMINHO_COMMONS}/Brindes/getBrindesByGestor`);

/** @type {typeof import('../../../Commons/Encantar/Solicitacoes/getSolicitacoesParaAprovar')} */
const getSolicitacoesParaAprovar = use(
  `${CAMINHO_COMMONS}/Solicitacoes/getSolicitacoesParaAprovar`
);
/** @type {typeof import('../../../Commons/Encantar/Solicitacoes/getAcaoHistoricoPorTipoAprovacao')} */
const getAcaoHistoricoPorTipoAprovacao = use(
  `${CAMINHO_COMMONS}/Solicitacoes/getAcaoHistoricoPorTipoAprovacao`
);
/** @type {typeof import('../../../Commons/Encantar/Solicitacoes/getSolicitacoesAprovacaoFinalizada')} */
const getSolicitacoesAprovacaoFinalizada = use(
  `${CAMINHO_COMMONS}/Solicitacoes/getSolicitacoesAprovacaoFinalizada`
);
/** @type {typeof import('../../../Commons/Encantar/Solicitacoes/podeIncluirSolicitacao')} */
const podeIncluirSolicitacao = use(
  `${CAMINHO_COMMONS}/Solicitacoes/podeIncluirSolicitacao`
);
/** @type {typeof import('../../../Commons/Encantar/salvarAnexos')} */
const salvarAnexos = use(`${CAMINHO_COMMONS}/salvarAnexos`);
/** @type {typeof import('../../../Commons/Encantar/Solicitacoes/getFluxoAprovacao')} */
const getFluxoAprovacao = use(
  `${CAMINHO_COMMONS}/Solicitacoes/getFluxoAprovacao`
);
/** @type {typeof import('../../../Commons/Encantar/Solicitacoes/getCapacitacaoCursos')} */
const getCapacitacaoCursos = use(
  `${CAMINHO_COMMONS}/Solicitacoes/getCapacitacaoCursos`
);
/** @type {typeof import('../../../Commons/Encantar/Solicitacoes/getDadosSolicitacao')} */
const getDadosSolicitacao = use(
  `${CAMINHO_COMMONS}/Solicitacoes/getDadosSolicitacao`
);
/** @type {typeof import('../../../Commons/Encantar/Solicitacoes/checaCapacitacaoIsento')} */
const checaCapacitacaoIsento = use(
  `${CAMINHO_COMMONS}/Solicitacoes/checaCapacitacaoIsento`
);
/** @type {typeof import('../../../Commons/Encantar/Solicitacoes/registraVideoVisualizado')} */
const registraVideoVisualizado = use(
  `${CAMINHO_COMMONS}/Solicitacoes/registraVideoVisualizado`
);
/** @type {typeof import('../../../Commons/Encantar/Solicitacoes/getPrefixosPermissaoEstoque')} */
const getPrefixosComBrindes = use(
  `${CAMINHO_COMMONS}/Estoque/getPrefixosComBrindes`
);

/** @type {typeof import('../../../Commons/Encantar/Solicitacoes/registrarEntregaCliente')} */
const registrarEntregaCliente = use(
  `${CAMINHO_COMMONS}/Entrega/registrarEntregaCliente`
);

/** @type {typeof import('../../../Commons/Encantar/Solicitacoes/registrarReacaoCliente')} */
const registrarReacaoCliente = use(
  `${CAMINHO_COMMONS}/Solicitacoes/registrarReacaoCliente`
);

/** @type {typeof import('../../../Commons/Encantar/NotificacoesService/')} */
const notificacoesService = use(`${CAMINHO_COMMONS}/NotificacoesService`);

//MODELS

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const solicitacoesModel = use(`${CAMINHO_MODELS}/Solicitacoes`);
/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const anexosModel = use(`${CAMINHO_MODELS}/Anexos`);
/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const brindesModel = use(`${CAMINHO_MODELS}/Brindes`);
/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const estoquesModel = use(`${CAMINHO_MODELS}/BrindesEstoque`);
/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const produtosBBModel = use(`${CAMINHO_MODELS}/ProdutosBB`);

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const classificacaoClientesModel = use(
  `${CAMINHO_MODELS}/ClassificacaoClientes`
);
const solicitacoesStatusModel = use(`${CAMINHO_MODELS}/SolicitacoesStatus`);

//TRANSFORMERS
const SolicitacoesTransfomer = use(
  "App/Transformers/Encantar/SolicitacoesTransformer"
);
const CursosTransformer = use("App/Transformers/Encantar/CursoTransformer");
const VideoTransformer = use("App/Transformers/Encantar/VideoTransformer");

//TypeDefs
const typeDefs = require("../../../Types/TypeUsuarioLogado");
const encantarTypes = require("./EncantarTypes");
const isComissaoNivelGerencial = require("../../../Commons/Arh/isComissaoNivelGerencial");
const registrarCancelamentoSolicitacao = require("../../../Commons/Encantar/Solicitacoes/registrarCancelamentoSolicitacao");

class SolicitacoesController {
  // REIMPLEMENTAR
  async serveBrindeImg({ request, response }) {
    const { idBrinde } = request.allParams();
    const brinde = await brindesModel.find(idBrinde);
    await brinde.load("imagem");
    var buf = Buffer.from(
      brinde.toJSON().imagem[0].base64.split(",")[1],
      "base64"
    );
    response
      .header("Content-Type", "image/png")
      .header("Content-length", `${buf.length}`)
      .send(buf);
  }

  // REIMPLEMENTAR
  async getSolicitacoesFinalizadas({ request, response, session, transform }) {
    const params = request.allParams();

    // Quando o nome da coluna no banco de dados for igual ao do filtro vindo do Front End, só precisa
    // de uma string com o nome do campo. Caso contrário, pode passar um array de campos no qual devem ser pesquisados
    const filtrosPesquisaTextual = [
      "mci",
      "nomeCliente",
      {
        nome: "solicitante",
        campos: ["matriculaSolicitante", "nomeSolicitantes"],
      },
      "status",
    ];
    const usuarioLogado = session.get("currentUserAccount");

    // Definição dos valores padrão
    if (!params.page) {
      page = "1";
    }
    if (!params.pageSize) {
      pageSize = "10";
    }

    //Construção da query condicional
    const query = solicitacoesModel.query();
    query
      .where("idStatus", STATUS_SOLICITACAO.FINALIZADO)
      .where("prefixoSolicitante", usuarioLogado.prefixo);

    //Inclui os filtros textuais
    for (const filtro of filtrosPesquisaTextual) {
      if (typeof filtro === "string" && params[filtro]) {
        query.where(filtro, "LIKE", `%${filtro}`);
      }

      if (typeof filtro === "object" && params[filtro.nome]) {
        query.where((builder) => {
          for (let campo of filtro.campos) {
            builder.orWhere(campo, params[filtro.nome]);
          }
        });
      }
    }

    //Ordenação
    if (params.sortField && params.sortOrder) {
      const order = params.sortOrder === "ascend" ? "asc" : "desc";
      query.orderBy(params.sortField, order);
    } else {
      //Ordenação Padrão
      query.orderBy("updatedAt", "desc");
    }

    //Execução da query
    const solicitacoes = await query
      .with("status")
      .paginate(params.page, params.pageSize);
    const transformed = await transform
      .usingVariant("finalizadas")
      .collection(solicitacoes.toJSON().data, SolicitacoesTransfomer);
    return {
      results: transformed,
      totalCount: solicitacoes.toJSON().total,
    };
  }

  async getSolicitacoesMeuPrefixo({ request, response, session, transform }) {
    /** @type {typeDefs.UsuarioLogado} */
    const usuarioLogado = session.get("currentUserAccount");

    const solicitacoes = await getSolicitacoesMeuPrefixo(usuarioLogado.prefixo);

    const transformed = await transform.collection(
      solicitacoes.toJSON(),
      "Encantar/SolicitacoesTransformer.meuPrefixo"
    );
    return response.ok(transformed);
  }

  async getSolicitacao({ request, response, session, transform }) {
    const { idSolicitacao } = request.allParams();
    /** @type {typeDefs.UsuarioLogado} */
    const usuarioLogado = session.get("currentUserAccount");
    const solicitacao = await getDadosSolicitacao(idSolicitacao);
    const solicitacaoTransformada = await transform.item(
      solicitacao,
      "Encantar/SolicitacoesTransformer.acompanharSolicitacao"
    );

    return response.ok(solicitacaoTransformada);
  }

  async editarLocalEntrega({ request, response, session, transform }) {
    const {
      cep,
      bairro,
      cidade,
      complemento,
      endereco,
      localEntrega,
      numero,
      idSolicitacao,
    } = request.allParams();

    if (localEntrega === LOCAL_ENTREGA.AGENCIA && !prefixoEntrega) {
      throw new exception(
        "Caso o local de entrega seja agência, deve informar o prefixo de entrega",
        400
      );
    }

    const trx = await Database.connection("encantar").beginTransaction();

    try {
      const solicitacao = await solicitacoesModel.find(idSolicitacao);

      if (!solicitacao) {
        throw new exception("Id da solicitação inválido", 400);
      }

      if (localEntrega) {
        solicitacao.localEntrega = localEntrega;
      }

      solicitacao.modeloEnderecoAntigo = false;
      await solicitacao.save(trx);
      await solicitacao.enderecoCliente().create(
        {
          cep,
          bairro,
          cidade,
          endereco,
          numero,
          complemento: complemento ? complemento : null,
        },
        trx
      );
      await trx.commit();
      return response.ok("Editado com sucesso");
    } catch (error) {
      await trx.rollback();
      throw new exception(error, 500);
    }
  }

  async cancelarSolicitacao({ request, response, transform, session }) {
    const { justificativa, idSolicitacao } = request.allParams();
    /** @type {typeDefs.UsuarioLogado} */
    const usuarioLogado = session.get("currentUserAccount");
    const anexos = getFilesFromRequest(request);
    const trx = await Database.connection("encantar").beginTransaction();

    try {
      await registrarCancelamentoSolicitacao({
        idSolicitacao,
        usuarioLogado,
        justificativa,
        anexos,
        trx,
      });
      await trx.commit();
      return response.ok("Cancelamento registrado");
    } catch (error) {
      await trx.rollback();
      throw new exception(error, 500);
    }
  }

  async getSolicitacoesAndamento({ request, response, transform, session }) {
    const { statusSolicitacao, somenteMeuPrefixo } = request.allParams();
    /** @type {typeDefs.UsuarioLogado} */
    const usuarioLogado = session.get("currentUserAccount");

    const queryResult = solicitacoesModel.query().with("status");

    if (parseInt(statusSolicitacao) !== 0) {
      queryResult.where("idSolicitacoesStatus", statusSolicitacao);
    }

    if (JSON.parse(somenteMeuPrefixo) === true) {
      queryResult.where("prefixoSolicitante", usuarioLogado.prefixo);
    }

    const solicitacoes = await queryResult.fetch();

    const transformed = await transform.collection(
      solicitacoes.toJSON(),
      "Encantar/SolicitacoesTransformer.acompanharPendentes"
    );

    response.ok(transformed);
  }

  async downloadAnexo({ request, response }) {
    const { idAnexo } = request.allParams();

    const anexo = await anexosModel.find(idAnexo);

    let tmpFileName = Helpers.appRoot("/cache/") + anexo.nome_arquivo;
    let bufferFile = new Buffer.from(anexo.base64, "base64");
    fs.writeFileSync(tmpFileName, bufferFile);
    response.attachment(tmpFileName);
    const exists = await Drive.exists(tmpFileName);

    if (exists) {
      await Drive.delete(tmpFileName);
    }
  }

  /**
   *    Retorna as solicitações pendentes de aprovação para o usuário logado
   *
   *    @param {object} ctx
   *    @param {AuthSession} ctx.auth
   *    @param {Request} ctx.request
   *    @param {View} ctx.view
   */

  async getBrindesPorGestor({ request, response, session, transform }) {
    try {
      const { prefixos, classificacao } = request.allParams();
      const classificacaoCliente = await classificacaoClientesModel.findBy(
        "classificacao",
        classificacao
      );
      const brindes = await getBrindesByGestor(prefixos, {
        somenteComEstoque: true,
        somenteAtivos: true,
        valorMaximo: classificacaoCliente.valor,
      });
      const brindesTransformados = await transform.collection(
        brindes.toJSON(),
        "Encantar/BrindesTransformer.estoque"
      );

      return brindesTransformados;
    } catch (error) {
      throw new exception(error, 500);
    }
  }

  /**
   * @param {object} ctx
   * @param {AuthSession} ctx.auth
   * @param {Request} ctx.request
   * @param {View} ctx.view
   */

  async solicitacaoParaAprovar({ request, response, session, transform }) {
    const { idSolicitacao } = request.allParams();
    /** @type {typeDefs.UsuarioLogado} */
    const usuarioLogado = session.get("currentUserAccount");

    const solicitacao = await getDadosSolicitacao(idSolicitacao);

    solicitacao.usuarioComPermissaoNoFluxoAtual =
      await usuarioTemPermissaoNoFluxo(usuarioLogado, solicitacao.fluxoAtual);

    const solicitacaoTransformada = await transform.item(
      solicitacao,
      "Encantar/SolicitacoesTransformer.acompanharSolicitacao"
    );

    return response.ok(solicitacaoTransformada);
  }

  async getPorCliente({ request, response, session, transform }) {}

  /**
   *  Rota para avançar uma Solicitação no fluxo de aprovação
   */

  async avancarFluxo({ request, response, session, tranform }) {
    /** @type {typeDefs.UsuarioLogado} */
    const usuarioLogado = session.get("currentUserAccount");
    const arquivos = getFilesFromRequest(request);

    const { idSolicitacao, avaliacao, justificativa, tipo } =
      parseParamsAvancarFluxo(request.allParams());

    const dadosAprovacao = {
      idSolicitacao,
      avaliacao,
      justificativa,
      tipo,
      arquivos,
      usuarioLogado,
      finalizadoEm: moment().format("YYYY-MM-DD HH:mm"),
    };

    const solicitacao = await solicitacoesModel.find(idSolicitacao);
    const fluxoAtual = await getFluxoAtualPorSolicitacao(idSolicitacao);
    const acaoHistoricoSolicitacao = getAcaoHistoricoPorTipoAprovacao(tipo);
    const trx = await Database.connection("encantar").beginTransaction();
    try {
      await atualizarFluxoAprovacao(dadosAprovacao, fluxoAtual, trx);
      await avancarSolicitacaoNoFluxo(
        tipo,
        solicitacao,
        fluxoAtual,
        usuarioLogado.chave,
        trx
      );
      await incluirHistoricoSolicitacao(
        solicitacao,
        usuarioLogado,
        acaoHistoricoSolicitacao,
        trx
      );

      await solicitacao.load("fluxoUtilizado");

      const isUltimo = await isUltimoDoFluxo(solicitacao.id, fluxoAtual);

      let dadosNotificacoes = [];
      if (tipo === "deferir") {
        dadosNotificacoes = isUltimo
          ? await notificacoesService.gerarNotificacaoResponsavelProduto(
              solicitacao.id
            )
          : await notificacoesService.gerarNotificacaoFluxo({
              idSolicitacao: solicitacao.id,
              sequenciaFluxoANotificar:
                solicitacao.toJSON().sequenciaFluxoAtual,
              fluxoAprovacao: solicitacao.toJSON().fluxoUtilizado,
              isUltimo,
            });

        //Caso de Indeferimento
      } else {
        dadosNotificacoes =
          await notificacoesService.gerarNotificacaoReprovacaoFluxo({
            idSolicitacao: solicitacao.id,
          });
      }

      const notificacoesCriadas = await solicitacao
        .notificacoes()
        .createMany(dadosNotificacoes, trx);
      await trx.commit();
      await notificacoesService.enviarNotificacoes(
        notificacoesCriadas.map((notificacao) => notificacao.id)
      );
      return response.ok();
    } catch (error) {
      await trx.rollback();
      throw new exception(error, 500);
    }
  }

  /**
   *
   * Retorna as solicitações pendentes de aprovação
   *
   * @param {object} ctx
   * @param {AuthSession} ctx.auth
   * @param {Request} ctx.request
   * @param {View} ctx.view
   */

  async getPendenciasAprovacao({ request, response, session, transform }) {
    const { tipoPendencia } = request.allParams();

    /** @type {typeDefs.UsuarioLogado} */
    const usuarioLogado = session.get("currentUserAccount");

    const prefixosComAcessoParaAprovar = await getPrefixosComAcessoParaAprovar(
      usuarioLogado
    );

    const solicitacoesParaAprovar = await getSolicitacoesParaAprovar(
      prefixosComAcessoParaAprovar,
      tipoPendencia
    );

    const transformadas = await transform.collection(
      solicitacoesParaAprovar.toJSON(),
      "Encantar/SolicitacoesTransformer.aprovacaoPendente"
    );

    response.ok(transformadas);
  }

  /**
   *
   *  Retorna as solicitações cuja aprovação já foi concluída. Tanto no caso de aprovado quanto reprovada
   *
   * @param {object} ctx
   * @param {AuthSession} ctx.auth
   * @param {Request} ctx.request
   * @param {View} ctx.view
   */

  async getAprovacoesFinalizadas({ request, response, session, transform }) {
    const { periodo } = request.allParams();
    /** @type {typeDefs.UsuarioLogado} */
    const usuarioLogado = session.get("currentUserAccount");

    const prefixosComAcessoParaAprovar = await getPrefixosComAcessoParaAprovar(
      usuarioLogado
    );

    const solicitacoesAprovacaoFinalizada =
      await getSolicitacoesAprovacaoFinalizada(
        prefixosComAcessoParaAprovar,
        periodo.map((data) => moment(JSON.parse(data)))
      );

    const transformadas = await transform.collection(
      solicitacoesAprovacaoFinalizada.toJSON(),
      "Encantar/SolicitacoesTransformer.finalizadas"
    );

    return response.ok(transformadas);
  }

  /**
   *  Rota que retorna a indicação de que o funcinário logado pode, ou não, incluir novas solicitações
   *
   *
   * @param {object} ctx
   * @param {AuthSession} ctx.auth
   * @param {Request} ctx.request
   * @param {View} ctx.view
   */

  async podeIncluirSolicitacao({ request, response, session }) {
    /** @type {typeDefs.UsuarioLogado} */
    const usuarioLogado = session.get("currentUserAccount");

    const permissao = await podeIncluirSolicitacao(usuarioLogado.prefixo);

    return response.ok({ podeIncluirSolicitacao: permissao });
  }

  /**
   * Método que retorna lista de produtos BB que podem estar vinculados a uma solicitação. Ex.: CDC, Cartão de Crédito e etc..
   *
   *
   * @param {object} ctx
   * @param {AuthSession} ctx.auth
   * @param {Request} ctx.request
   * @param {View} ctx.view
   */

  async getProdutosBB({ request, response, session, transform }) {
    const produtosBB = await produtosBBModel.all();
    return response.ok(produtosBB);
  }

  /**
   *
   *  Marca um determinado vídeo como visualizado, pelo usuário logado
   *
   * @param {object} ctx
   * @param {AuthSession} ctx.auth
   * @param {Response} ctx.response
   * @param {Request} ctx.request
   * @param {View} ctx.view
   */

  async visualizouVideo({ response, request, session }) {
    const { idVideo } = request.allParams();

    /** @type {typeDefs.UsuarioLogado} */
    const usuarioLogado = session.get("currentUserAccount");

    await registraVideoVisualizado(
      idVideo,
      usuarioLogado.chave,
      usuarioLogado.nome_usuario
    );
    response.ok();
  }

  /**
   *
   *  Retornar as solicitações que estão pendentes de entrega para o cliente final
   */

  async getSolicitacoesPendentesEntregaCliente({
    request,
    response,
    session,
    transform,
  }) {
    const solicitacoesPendentesEntrega =
      await getSolicitacoesPendentesEntregaCliente();
    const solicitacoesTransformadas = await transform.collection(
      solicitacoesPendentesEntrega.toJSON(),
      "Encantar/SolicitacoesTransformer.pendentesEntrega"
    );

    return response.ok(solicitacoesTransformadas);
  }

  /**
   *  Rota que retorna as solicitações passíveis de registro da reação
   *
   */
  async getSolicitacoesParaReacao({ response, parsedParams }) {
    const filtros = parsedParams;
    const solicitacoes = await getSolicitacoesParaReacao(filtros);

    response.ok(solicitacoes);
  }

  async verificarSolicitacaoParaRacao({ response, request }) {
    const { idSolicitacao } = request.allParams();
    const isValido = await isSolicitacaoParaReacao(idSolicitacao);

    return isValido
      ? response.ok("valido")
      : response.badRequest("Solicitação não passível de registro para reação");
  }

  async getMinhasSolicitacoesParaReacao({
    response,
    request,
    session,
    parsedParams,
  }) {
    const usuarioLogado = session.get("currentUserAccount");
    const { periodoSolicitacao } = parsedParams;
    const isAdmin = await hasPermission({
      nomeFerramenta: "Encantar",
      dadosUsuario: usuarioLogado,
      permissoesRequeridas: ["ADM_ENCANTAR"],
    });
    const solicitacoes = await getMinhasSolicitacoesParaReacao(
      periodoSolicitacao,
      usuarioLogado,
      isAdmin
    );

    return solicitacoes;
  }

  async getPermRegistroReacao({ response, session }) {
    const usuarioLogado = session.get("currentUserAccount");
    const permRegistroReacao = await verificarPermissaoRegistroReacao(
      usuarioLogado
    );
    return response.ok(permRegistroReacao);
  }

  async getPermIncluirSolicitacao({ response, session }) {
    const usuarioLogado = session.get("currentUserAccount");
    const permIncluirSolicitacao = await verificarPermissaoIncluirSolicitacao(
      usuarioLogado
    );
    return response.ok(permIncluirSolicitacao);
  }

  async salvarReacao({ response, parsedParams, session }) {
    const usuarioLogado = session.get("currentUserAccount");
    try {
      await registrarReacaoCliente({
        ...parsedParams,
        matricula: usuarioLogado.chave,
        nome: usuarioLogado.nome_usuario,
      });
    } catch (error) {
      throw new exception(error, 500);
    }

    response.ok("Salvo");
  }

  /**
   *
   *   Retorna as solicitações pendentes de envio para o cliente ou para o prefixo
   *
   */

  async getSolicitacoesPendentesParaEnvio({
    request,
    response,
    session,
    transform,
  }) {
    /** @type {typeDefs.UsuarioLogado} */
    const usuarioLogado = session.get("currentUserAccount");

    const solicitacoesPendentesEnvio = await getSolicitacoesPendentesParaEnvio(
      usuarioLogado,
      STATUS_SOLICITACAO.DEFERIDA
    );

    const solicitacoesTransformadas = await transform.collection(
      solicitacoesPendentesEnvio,
      "Encantar/SolicitacoesTransformer.pendentesEntrega"
    );

    return response.ok(solicitacoesTransformadas);
  }

  async getSolicitacoesDevolvidas({ request, response, session, transform }) {
    /** @type {typeDefs.UsuarioLogado} */
    const usuarioLogado = session.get("currentUserAccount");

    const solicitacoesPendentesEnvio = await getSolicitacoesPendentesParaEnvio(
      usuarioLogado,
      STATUS_SOLICITACAO.PENDENTE_DEVOLVIDA
    );

    const solicitacoesTransformadas = await transform.collection(
      solicitacoesPendentesEnvio,
      "Encantar/SolicitacoesTransformer.devolvidas"
    );

    return response.ok(solicitacoesTransformadas);
  }

  /**
   *
   *  Rota que retorna as retorna as solicitações que estão na fase 'PENDENTE RECEBIMENTO', ou seja, estão pendentes de recebimento em um prefixo
   *
   * @param {object} ctx
   * @param {AuthSession} ctx.auth
   * @param {Request} ctx.request
   * @param {View} ctx.view
   */

  async getSolicitacoesPendentesParaRecebimentoPrefixo({
    request,
    response,
    session,
    transform,
  }) {
    /** @type {typeDefs.UsuarioLogado} */
    const usuarioLogado = session.get("currentUserAccount");
    const solicitacoesParaRecebimento =
      await getSolicitacoesPendentesParaRecebimentoPrefixo(usuarioLogado);
    const solicitacoesTransformadas = await transform.collection(
      solicitacoesParaRecebimento.toJSON(),
      "Encantar/SolicitacoesTransformer.pendentesRecebimento"
    );

    return response.ok(solicitacoesTransformadas);
  }

  /**
   *
   *  Registra o recebimento da solicitação quando foi enviada para um prefixo
   *
   */
  async registrarRecebimentoPrefixo({ request, response, transform, session }) {
    const { observacoes, idSolicitacao, dataRecebimento } = request.allParams();

    /** @type {typeDefs.UsuarioLogado} */
    const usuarioLogado = session.get("currentUserAccount");
    const trx = await Database.connection("encantar").beginTransaction();

    //Recupera a lista de arquivos
    const anexos = getFilesFromRequest(request);

    try {
      await registrarRecebimentoSolicitacao(
        {
          idSolicitacao,
          observacoes,
          dataRecebimento: moment(dataRecebimento).format("YYYY-MM-DD"),
          anexos,
        },
        usuarioLogado,
        trx
      );
      await trx.commit();
    } catch (error) {
      await trx.rollback();
      throw new exception(error, 500);
    }

    return response.ok("Tudo certo");
  }

  /**
   *   Registra o envio final dos brindes/carta para o cliente ou prefixo
   */

  async registrarEnvio({ request, response, session }) {
    const {
      identificadorEntrega,
      idSolicitacao,
      informacoes,
      tipoEntrega,
      dataEnvio,
      valorFrete,
    } = request.allParams();

    const trx = await Database.connection("encantar").beginTransaction();

    try {
      /** @type {typeDefs.UsuarioLogado} */
      const usuarioLogado = session.get("currentUserAccount");

      //Recupera a lista de arquivos
      const anexos = getFilesFromRequest(request);

      await registrarEnvioSolicitacao(
        {
          identificadorEntrega,
          valorFrete,
          idSolicitacao,
          informacoes,
          tipoEntrega,
          dataEnvio: moment(dataEnvio).format("YYYY-MM-DD"),
          anexos,
        },
        usuarioLogado,
        trx
      );

      await removerBrindesSelecionadosDoEstoque(idSolicitacao, trx);
      const solicitacao = await solicitacoesModel.find(idSolicitacao);
      const dadosNotificacoes =
        await notificacoesService.gerarNotificacaoEnvioPrefixo(
          solicitacao.toJSON()
        );

      const notificacoesCriadas = await solicitacao
        .notificacoes()
        .createMany(dadosNotificacoes, trx);

      await trx.commit();
      await notificacoesService.enviarNotificacoes(
        notificacoesCriadas.map((notificacao) => notificacao.id)
      );
      response.ok();
    } catch (error) {
      await trx.rollback();
      throw new exception(error, 500);
    }
  }

  async registrarFalhaEnvio({ request, response, session }) {
    /** @type {typeDefs.UsuarioLogado} */
    const usuarioLogado = session.get("currentUserAccount");
    const { idSolicitacao, justificativa, dataDevolucao } = request.allParams();
    const trx = await Database.connection("encantar").beginTransaction();
    try {
      const anexos = getFilesFromRequest(request);
      await registrarFalhaEntrega(
        trx,
        idSolicitacao,
        justificativa,
        dataDevolucao,
        usuarioLogado,
        anexos
      );
      response.ok("Registro efetuado com sucesso");
    } catch (error) {
      await trx.rollback();
      throw new exception(error, 500);
    }
  }

  async registrarEntregaCliente({ request, response, session }) {
    const {
      idSolicitacao,
      resultadoEntregaCliente,
      dataResultadoEntrega,
      informacoes,
    } = request.allParams();

    /** @type {typeDefs.UsuarioLogado} */
    const usuarioLogado = session.get("currentUserAccount");
    const trx = await Database.connection("encantar").beginTransaction();

    //Recupera a lista de arquivos
    const anexos = getFilesFromRequest(request);

    try {
      await registrarEntregaCliente(
        {
          idSolicitacao,
          resultadoEntregaCliente,
          informacoes,
          dataResultadoEntrega:
            moment(dataResultadoEntrega).format("YYYY-MM-DD"),
          anexos,
        },
        usuarioLogado,
        trx
      );
      await trx.commit();
    } catch (error) {
      await trx.rollback();
      throw new exception(error, 500);
    }

    return response.ok("Tudo certo");
  }

  /**
   *
   *  Retorna os dados um cliente através do seu mci. Junto aos dados do cliente
   *  retorna lista de solicitações anteriores que não foram canceladas e nem indeferidas.
   *
   * @param {object} ctx
   * @param {AuthSession} ctx.auth
   * @param {Request} ctx.request
   * @param {View} ctx.view
   *
   */

  async getDadosClienteParaSolicitacao({ request, response, transform }) {
    const { mci } = request.allParams();
    try {
      const dadosCliente = await getDadosClientesEncantar({ mci });
      if (dadosCliente === null) {
        return response.notFound("Cliente não encontrado");
      }
      response.ok(dadosCliente);
    } catch (error) {
      throw new exception(error, 500);
    }
  }

  /**
   *
   *  Verifica se a capacitação obrigatória para gravar solicitação foi cumprida.
   *
   * @param {object} ctx
   * @param {AuthSession} ctx.auth
   * @param {Response} ctx.response
   * @param {Request} ctx.request
   * @param {View} ctx.view
   *
   */

  async verificaCapacitacao({ response, session, transform }) {
    /** @type {typeDefs.UsuarioLogado} */
    const usuarioLogado = session.get("currentUserAccount");

    const videos = await getCapacitacaoVideos(usuarioLogado.chave);
    const cursos = await getCapacitacaoCursos(usuarioLogado.chave);
    const isento = await checaCapacitacaoIsento(usuarioLogado.chave);

    const videosTransformados = await transform.collection(
      videos.toJSON(),
      VideoTransformer
    );
    const cursosTransformados = await transform.collection(
      cursos.toJSON(),
      CursosTransformer
    );

    return response.ok({
      videos: videosTransformados,
      cursos: cursosTransformados,
      isento,
    });
  }

  /**
   *
   *  Método que registrar o tratamento para a devolução de uma solicitação. O tratamento pode ser para cancelar a solicitação ou
   *  para enviar para o reenvio.
   *
   *
   * @param {object} ctx
   * @param {AuthSession} ctx.auth
   * @param {Response} ctx.response
   * @param {Request} ctx.request
   * @param {View} ctx.view
   *
   */

  async tratarDevolucao({ request, response, session }) {
    const { CANCELAR, REENVIAR } = TRATAMENTOS_DEVOLUCAO;
    const tratamentosDevolucao = [CANCELAR, REENVIAR];

    const {
      tratamentoDevolucao,
      informacoesTratamentoDevolucao,
      idSolicitacao,
    } = request.allParams();

    if (!tratamentosDevolucao.includes(tratamentoDevolucao)) {
      throw new exception(`Tratamento '${tratamentoDevolucao}' inválido.`, 400);
    }

    /** @type {typeDefs.UsuarioLogado} */
    const usuarioLogado = session.get("currentUserAccount");
    const anexos = getFilesFromRequest(request);

    const trx = await Database.connection("encantar").beginTransaction();

    try {
      const solicitacao = await solicitacoesModel.find(idSolicitacao);

      const devolucao = await solicitacao.tratamentoDevolucao().create(
        {
          respRegistroMatricula: usuarioLogado.chave,
          respRegistroNome: usuarioLogado.nome_usuario,
          prefixo: usuarioLogado.prefixo,
          nomePrefixo: usuarioLogado.dependencia,
          informacoesDevolucao: informacoesTratamentoDevolucao,
        },
        trx
      );

      await salvarAnexos(
        devolucao,
        anexos,
        "TRATAMENTO_DEVOLUCAO",
        usuarioLogado.chave,
        trx,
        "anexos"
      );

      let acao = null;

      switch (tratamentoDevolucao) {
        case CANCELAR:
          await registrarCancelamentoSolicitacao({
            idSolicitacao,
            usuarioLogado,
            justificativa:
              "Solicitação cancelada após devolução do envio. Para maiores detalhes, verifique as informações da devolução.",
            anexos: [],
            trx,
          });
          acao = ACOES_HISTORICO_SOLICITACAO.CANCELAR_DEVOLVIDA;
          solicitacao.idSolicitacoesStatus = STATUS_SOLICITACAO.CANCELADA;
          break;
        case REENVIAR:
          solicitacao.idSolicitacoesStatus = STATUS_SOLICITACAO.DEFERIDA;
          acao = ACOES_HISTORICO_SOLICITACAO.MARCAR_PARA_REENVIO;
          break;
      }

      await solicitacao.historico().create(
        {
          matriculaFunci: usuarioLogado.chave,
          nomeFunci: usuarioLogado.nome_usuario,
          prefixo: usuarioLogado.prefixo,
          nomePrefixo: usuarioLogado.dependencia,
          idAcao: acao,
        },
        trx
      );
      await solicitacao.save(trx);
      await trx.commit();
    } catch (error) {
      await trx.rollback();
      throw new exception(error, 500);
    }
    return response.ok("Tratamento da devolução registrado.");
  }

  /**
   *
   *  Método que registrar o cancelamento de uma solicitação devolvida
   *
   * @param {object} ctx
   * @param {AuthSession} ctx.auth
   * @param {Response} ctx.response
   * @param {Request} ctx.request
   * @param {View} ctx.view
   *
   */

  async cancelarSolicitacaoDevolvida({ request, response, session }) {
    const { justificativa, idSolicitacao } = request.allParams();
    /** @type {typeDefs.UsuarioLogado} */
    const usuarioLogado = session.get("currentUserAccount");
    const anexos = getFilesFromRequest(request);
    const trx = await Database.connection("encantar").beginTransaction();

    try {
      await registrarCancelamentoSolicitacao({
        idSolicitacao,
        usuarioLogado,
        justificativa,
        anexos,
        trx,
      });
      await solicitacao.historico().create(
        {
          matriculaFunci: usuarioLogado.chave,
          nomeFunci: usuarioLogado.nome_usuario,
          prefixo: usuarioLogado.prefixo,
          nomePrefixo: usuarioLogado.dependencia,
          idAcao: ACOES_HISTORICO_SOLICITACAO.CANCELAMENTO,
        },
        trx
      );
      await trx.commit();
      return response.ok("Cancelamento registrado");
    } catch (error) {
      await trx.rollback();
      throw new exception(error, 500);
    }
  }

  /**
   *
   *  Método que salva uma nova solicitação
   *
   *
   * @param {object} ctx
   * @param {AuthSession} ctx.auth
   * @param {Response} ctx.response
   * @param {Request} ctx.request
   * @param {View} ctx.view
   */

  async salvarSolicitacao({ request, response, session }) {
    const params = request.allParams();
    /** @type {encantarTypes.NovaSolicitacao} */
    const {
      brindesSelecionados,
      dadosCliente,
      redesSociais,
      dadosEntrega,
      enderecoCliente,
    } = jsonParseObjeto(
      [
        "brindesSelecionados",
        "dadosCliente",
        "redesSociais",
        "dadosEntrega",
        "enderecoCliente",
      ],
      params
    );

    const { descricaoCaso, mci, txtCarta, idProdutoBB, prefixoFato } = params;

    /** @type {typeDefs.UsuarioLogado} */
    const usuarioLogado = session.get("currentUserAccount");
    const fluxoAprovacao = await getFluxoAprovacao(usuarioLogado.prefixo);

    const trx = await Database.connection("encantar").beginTransaction();

    try {
      //Salva dados da solicitação
      const solicitacao = new solicitacoesModel();
      solicitacao.mci = mci;
      solicitacao.prefixoFato = prefixoFato;
      solicitacao.nomeCliente = dadosCliente.nomeCliente;
      solicitacao.prefixoRelacCliente = dadosCliente.prefixoEncarteirado;
      solicitacao.matriculaSolicitante = usuarioLogado.chave;
      solicitacao.nomeSolicitante = usuarioLogado.nome_usuario;
      solicitacao.prefixoSolicitante = usuarioLogado.prefixo;
      solicitacao.nomePrefixoSolicitante = usuarioLogado.dependencia;
      solicitacao.idProdutoBB = idProdutoBB;
      solicitacao.dataSolicitacao = moment();
      solicitacao.sequenciaFluxoAtual = 1;
      solicitacao.idSolicitacoesStatus = STATUS_SOLICITACAO.PENDENTE_APROVACAO;
      solicitacao.descricaoCaso = descricaoCaso;
      solicitacao.txtCarta = txtCarta;
      solicitacao.prefixoEntrega = dadosEntrega.prefixoEntrega
        ? dadosEntrega.prefixoEntrega.prefixo
        : null;
      solicitacao.nomePrefixoEntrega = dadosEntrega.prefixoEntrega
        ? dadosEntrega.prefixoEntrega.nome
        : null;
      solicitacao.localEntrega = dadosEntrega.localEntrega;

      //Marcações das solicitações anteriores à implementaçãodo endereço do cliente
      solicitacao.modeloEnderecoAntigo = false;
      //Após a criação do endereço do cliente, o campo complementoEntrega será sempre null
      solicitacao.complementoEntrega = null;

      await solicitacao.save(trx);

      await solicitacao.enderecoCliente().create(
        {
          cep: enderecoCliente.cep,
          endereco: enderecoCliente.endereco,
          complemento: enderecoCliente.complemento
            ? enderecoCliente.complemento
            : null,
          numero: enderecoCliente.numero,
          bairro: enderecoCliente.bairro,
          cidade: enderecoCliente.cidade,
        },
        trx
      );

      //Recupera a lista de arquivos
      const arquivos = getFilesFromRequest(request);

      //Salva os eventuais anexos
      await salvarAnexos(
        solicitacao,
        arquivos,
        "solicitacao",
        usuarioLogado.chave,
        trx
      );

      if (brindesSelecionados) {
        await solicitacao.brindes().createMany(
          brindesSelecionados.map((brinde) => {
            return {
              idBrinde: brinde.idBrinde,
              prefixo: brinde.dadosEstoque.prefixo,
              idEstoque: brinde.dadosEstoque.id,
              quantidadeSelecionada: brinde.quantidadeSelecionada,
              dadosBrindeSelecionado: JSON.stringify(brinde),
            };
          }),
          trx
        );
      }

      await solicitacao.fluxoUtilizado().createMany(
        fluxoAprovacao.map((fluxo) => {
          return {
            prefixo: fluxo.prefixo,
            nomePrefixo: fluxo.nomePrefixo,
            prefixoAutorizador: fluxo.prefixoAutorizador,
            nomePrefixoAutorizador: fluxo.nomePrefixoAutorizador,
            sequencia: fluxo.sequencia,
            finalizadoEm: null,
            uor: fluxo.uor,
          };
        }),
        trx
      );

      await solicitacao.redesSociais().createMany(
        redesSociais.map((redeSocial) => {
          return {
            mci: mci,
            usuario: redeSocial.usuario,
            qtdSeguidores: redeSocial.qtdSeguidores,
            tipo: redeSocial.tipo,
          };
        }),
        trx
      );

      await solicitacao.historico().create(
        {
          matriculaFunci: usuarioLogado.chave,
          nomeFunci: usuarioLogado.nome_usuario,
          prefixo: usuarioLogado.prefixo,
          nomePrefixo: usuarioLogado.dependencia,
          idAcao: ACOES_HISTORICO_SOLICITACAO.INCLUIR_SOLICITACAO,
        },
        trx
      );

      await reservarBrindes(brindesSelecionados, usuarioLogado.chave, trx);
      const dadosNotificacoes = await notificacoesService.gerarNotificacaoFluxo(
        {
          idSolicitacao: solicitacao.id,
          fluxoAprovacao,
          sequenciaFluxoANotificar: 1,
        }
      );

      const notificacoesCriadas = await solicitacao
        .notificacoes()
        .createMany(dadosNotificacoes, trx);

      await trx.commit();

      await notificacoesService.enviarNotificacoes(
        notificacoesCriadas.map((notificacao) => notificacao.id)
      );
      return response.ok({ idSolicitacao: solicitacao.id });
    } catch (error) {
      await trx.rollback();
      throw new exception(error, 500);
    }
  }

  /**
   *   Retorna a lista de prefixos com estoque nos quais o usuário tem acesso.
   *   As regras são :
   *      1 - Todos os prefixos marcados com estoques Globais, na tabela brindesEstoquePermissao
   *      2 - Prefixos que estão na hierarquia do prefixoFato (subordinadas ou subordinantes) e possuem permissão para ter estoque
   *
   *   A ordenção para a lista de estoques é:
   *     1 - Prefixos subordinados
   *     2 - Prefixos subordinantes
   *     3 - Prefixos com estoques globais
   *
   * @param {String} prefixoFato
   */

  async getEstoquesPorPrefixo({ request, response, session }) {
    const { prefixoFato } = request.allParams();

    const hierarquia = await getHierarquiaDependencia(prefixoFato);

    const prefixosComBrindes = await getPrefixosComBrindes({
      subordinadas: hierarquia.subordinadas.map((prefixo) => prefixo.prefixo),
      subordinantes: hierarquia.subordinantes.map((prefixo) => prefixo.prefixo),
    });

    return response.ok(prefixosComBrindes);
  }

  /**
   *  Retorna a lista de brindes de acordo com o prefixo do gestor dos mesmos
   * @param {*} prefixoGestor
   */

  async _getBrindesByGestor(prefixoGestor) {
    const brindes = await estoquesModel
      .query()
      .where("prefixo", prefixoGestor)
      .with("brinde", (builder) => {
        builder.with("imagem", (builder) => {
          builder.select("id");
        });
      })
      .whereRaw("qtdEstoque - (qtdEntregue + qtdReserva) > 0")
      .fetch();

    return brindes;
  }

  async alterarTextoCarta({ request, response }) {
    try {
      let { id, textoCartaAlterado } = request.allParams();

      if (!id || !textoCartaAlterado) {
        throw new exception(
          "Parâmetros obrigatórios não foram informados!",
          400
        );
      }

      let solicitacao = await solicitacoesModel.find(id);

      if (!solicitacao) {
        throw new exception("Solicitação não encontrada!", 400);
      }

      if (
        solicitacao.idSolicitacoesStatus !==
        STATUS_SOLICITACAO.PENDENTE_APROVACAO
      ) {
        throw new exception(
          "Estado da solicitação não permite alteração da carta!",
          400
        );
      }

      solicitacao.txtCarta = textoCartaAlterado;
      await solicitacao.save();

      response.ok();
    } catch (error) {
      throw new exception(error, 500);
    }
  }

  async getStatusSolicitacoesList({ response }) {
    const statusList = await solicitacoesStatusModel
      .query()
      .setVisible(["id", "descricao"])
      .fetch();
    response.send(statusList);
  }
}

module.exports = SolicitacoesController;
