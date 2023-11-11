"use strict"

const _ = require("lodash");
const Database = use("Database");

const exception = use("App/Exceptions/Handler");
const hasPermission = use("App/Commons/HasPermission");

const Negativa = use("App/Models/Mysql/Designacao/Negativa");
const Solicitacao = use("App/Models/Mysql/Designacao/Solicitacao");
const TipoHistorico = use("App/Models/Mysql/Designacao/TipoHistorico");
const Designacao = use("App/Models/Mysql/Designacao");
const Uors500g = use("App/Models/Mysql/Arh/Uors500g");
const Funci = use("App/Models/Mysql/Arh/Funci");

const {
  Analise: EntityAnalise,
  Historico: EntityHistorico,
  TiposHistorico: EntityTiposHistorico,
  Responsavel: EntityResponsavel,
  Solicitacao: EntitySolicitacao,
} = use("App/Commons/Designacao/entidades");

const {
  carregarOptsBasicos,
  getAcessoSuperadm,
  getActualFunciProfile,
  getAnalise,
  getConcluidos,
  getConsultas,
  getDeAcordo,
  getDepESubordArh,
  getDestino,
  getDiasInuteis,
  getDotacaoDependencia,
  getFunciJaSolicitado,
  getGerevsPlataforma,
  getHistorico,
  getMainEmail,
  getMatchedFuncis,
  getMatchedFuncisLotados,
  getMatchedFuncisMovimentados,
  getOrigem,
  getPendencias,
  getPerfilFunci,
  getPermissao,
  getPrefixoMadrinha,
  getPrefixosSubord,
  getPrimGestor,
  getProtocolos,
  getResponsavel,
  getSituacoes,
  getSolicitacao,
  getStatus,
  getTemplate,
  getTipoAcesso,
  getTipoHistorico,
  isPrefixoSuperAdm,
  postSolicitacao,
  setAnalise,
  setConcluir,
  setDeAcordo,
  setDocumento,
  setEncaminhar,
  setHistorico,
  setResponsavel,
  setTemplate,
  tiposMovt,
} = use("App/Commons/Designacao");

const {
  AnalisesRepository,
  DeAcordoRepository,
  CodigosAusenciaRepository,
  DocumentosRepository,
  FuncisRepository,
  HistoricosRepository,
  LimitrofesRepository,
  MailRepository,
  MunicipiosRepository,
  NegativasRepository,
  OptsBasicasRepository,
  PrefixosRepository,
  PrefixosTesteRepository,
  SituacoesRepository,
  SolicitacoesRepository,
  StatusRepository,
  TemplatesRepository,
  TiposHistoricosRepository,
  TiposRepository,
} = use('App/Commons/Designacao/repositories');

const {
  getComitesAdmByMatricula,
  getDadosComissao,
  getDadosComissaoCompleto,
  getLatLong,
  getListaComitesByMatricula,
  getOneDependencia,
  getRotaRodoviaria,
  isAdmin,
  isFunciIncorporado,
  isNomeacaoPendente,
  isPrefixoUN,
  isUsuarioPrefixoGerev,
} = use("App/Commons/Arh");

const { limitrofes } = use("App/Commons/Mst");

const {
  isFeriadoNacional,
  isFeriadoPrefixo,
  isFinalSemana,
  dateDif,
  getFeriadosNacionais,
  getFeriadosPrefixo,
  getFeriadosFixos,
} = use("App/Commons/DateUtils");

const {
  UcCarregarOptsBasicos,
  UcConsultas,
  UcFindDepESubordArh,
  UcGetAnalise,
  UcGetDeAcordo,
  UcGetDestino,
  UcGetDiasNaoUteis,
  UcGetDiasUteis,
  UcGetFunciJaSolicitado,
  UcGetHistorico,
  UcGetListaSolicitacoes,
  UcGetListaSolicitacoesConcluidas,
  UcGetOrigem,
  UcGetQtdeDias,
  UcGetResponsavel,
  UcGetResultadoAnalise,
  UcGetSolicitacao,
  UcGetTiposHistorico,
  UcLoadTipos,
  UcMatchedCodsAusencia,
  UcMatchedFuncis,
  UcNovaSolicitacao,
  UcSetDeAcordo,
  UcSetResponsavel,
  UcGetAusProgrPorFunci,
  UcGetPrefixosTeste,
  UcSetDocumento,
} = use("App/Commons/Designacao/useCases");

const {
  ABAS,
  PREFIXO_DIRAV,
  PREFIXO_DIVAR
} = use("App/Commons/Designacao/Constants");

const getPrimeiroGestorPorPrefixo = use("App/Commons/Mst/getPrimeiroGestorPorPrefixo");
const JsonExport = use("App/Commons/JsonExport");
const moment = use("App/Commons/MomentZone");

class DesignacaoController {
  /**
   * método para Buscar um código de Ausência.
   * @param request AdonisJs Request Object
   * @param response AdonisJs Response Object
   */
  async findMatchedCodsAusencia({ request, response }) {
    let { codigo, lista } = request.allParams();

    const codigoAusenciaRepository = new CodigosAusenciaRepository();

    const codsAusencia = new UcMatchedCodsAusencia({
      repository: {
        codigoAusenciaRepository
      }
    });

    const { payload: resultado, error } = await codsAusencia.run({ codigo, lista });

    if (error) {
      throw new exception("Falha ao consultar os códigos de ausências!", 400);
    }

    return response.ok(resultado);
  }

  /**
     * método para Buscar um funcionário pesquisando por partes da matrícula ou do nome.
     * @param request AdonisJs Request Object
     * @param response AdonisJs Response Object
     * @param Session Object :: Dados de usuário gerado pelo Token de sessão :: SuperADM
     */
  async findMatchedFuncis({ request, response, session }) {
    const user = await this._user({ session });
    const { funci, tipo } = request.allParams();
    const funcisRepository = new FuncisRepository();
    const prefsTesteRepository = new PrefixosTesteRepository();

    const funcis = new UcMatchedFuncis({
      repository: {
        funcisRepository,
        prefsTesteRepository
      }
    });

    const { payload: funcionarios, error } = await funcis.run({
      funci,
      user,
      tipo: tipo ? parseInt(tipo, 10) : 0
    });

    if (error) {
      throw new exception("Falha ao consultar os dados do funcionário!", 400);
    }

    return response.ok(funcionarios);
  }

  /**
   *
   * Método para gravar a solicitação de Designação no Banco de Dados
   * @param request AdonisJs Request Object
   * @param response AdonisJs Response Object
   * @param Session Object :: Dados de usuário gerado pelo Token de sessão :: SuperADM
   */
  async gravarSolicitacao({ request, response, session }) {
    const user = session.get("currentUserAccount");

    let { dados } = request.allParams();

    const trx = await Database.connection("designacao").beginTransaction();

    const solicitacaoRepository = new SolicitacoesRepository();
    const analiseRepository = new AnalisesRepository();
    const deAcordoRepository = new DeAcordoRepository();
    const documentoRepository = new DocumentosRepository();
    const mailRepository = new MailRepository();

    const novaSolicitacao = new UcNovaSolicitacao({
      repository: {
        analiseRepository,
        deAcordoRepository,
        documentoRepository,
        mailRepository,
        solicitacaoRepository,
      },
      functions: {
        isPrefixoUN,
        isAdmin,
        getPrefixoMadrinha
      },
      trx
    });

    const { payload: solicitacao, error } = await novaSolicitacao.run({
      dados,
      user
    });

    if (error) {
      await trx.rollback();
      throw new exception("Falha ao gravar a solicitação!", 500);
    }

    await trx.commit();

    return response.ok(solicitacao);
  }

  /**
   *
   * Método para receber as justificativas para basear a solicitação de movimentação
   * @param request AdonisJs Request Object
   * @param response AdonisJs Response Object
   */

  async loadOptsBasicas({ request, response }) {
    const { dados } = request.allParams();
    const data = JSON.parse(dados);
    const { funcao, dotacao } = data;

    const optsBasicasRepository = new OptsBasicasRepository();

    const ucOptsBasicas = new UcCarregarOptsBasicos({
      repository: {
        optsBasicasRepository
      },
      functions: {}
    });

    const { payload: opcoes, error } = await ucOptsBasicas.run({ funcao, dotacao });

    if (error) {
      throw new exception(
        "Falha ao consultar a tabela de opções dos motivos de ausência!",
        400
      );
    }

    return response.ok(opcoes);
  }

  /**
   * Método para gerar os dados do Destino a serem usados pela análise do Funci para determinada vaga.
   * @param request AdonisJs Request Object
   * @param response AdonisJs Response Object
   */
  async getDestino({ request, response }) {
    const { dadosVaga } = request.allParams();
    const { prefixo, funci, funcao, motivo } = dadosVaga;

    const prefixoRepository = new PrefixosRepository();
    const funciRepository = new FuncisRepository();
    const municipioRepository = new MunicipiosRepository();

    const ucGetDestino = new UcGetDestino({
      repository: {
        prefixoRepository,
        funciRepository,
        municipioRepository
      },
      functions: {}
    });

    const { payload: destino, error } = await ucGetDestino.run({
      prefixo,
      funcionario: {
        funci: funci || null,
        funcao: funcao || null,
        optbasica: motivo || null,
      }
    });

    if (error) {
      throw new exception("Falha ao consultar os dados do prefixo de destino!", 400);
    }
    return response.ok(destino);
  }

  /**
   * Método para gerar os dados da Origem a serem usados pela análise do Funci para determinada vaga.
   * @param request AdonisJs Request Object
   * @param response AdonisJs Response Object
   */
  async getOrigem({ request, response }) {
    let { funci } = request.allParams();

    const prefixoRepository = new PrefixosRepository();
    const funciRepository = new FuncisRepository();
    const municipioRepository = new MunicipiosRepository();

    const ucGetOrigem = new UcGetOrigem({
      repository: {
        prefixoRepository,
        funciRepository,
        municipioRepository
      },
      functions: {}
    });

    const { payload: origem, error } = await ucGetOrigem.run({ funci });

    if (error) {
      throw new exception("Falha ao consultar os dados do funcionário de origem!", 400);
    }

    return response.ok(origem);
  }

  /**
   * Método para receber todas as pendências dos prefixos subordinados ao prefixo do funcionário a fazer a consulta.
   * @param request AdonisJs Request Object
   * @param response AdonisJs Response Object
   * @param Session Object :: Dados de usuário gerado pelo Token de sessão :: SuperADM
   */
  async getPendencias({ request, response, session }) {
    const usuario = await this._user({ session });
    const { tipoAcesso } = request.allParams();

    const solicitacao = new EntitySolicitacao();

    const solicitacaoRepository = new SolicitacoesRepository();
    const getListaPendencias = new UcGetListaSolicitacoes({
      repository: {
        solicitacaoRepository
      }
    });

    const { payload, error } = await getListaPendencias.run({
      tipoAcesso: parseInt(tipoAcesso, 10),
      user: usuario,
    });

    if (error) {
      throw new exception("Falha ao listar as pendências!", 400);
    }

    const pendencias = !_.isEmpty(payload)
      ? await solicitacao.transformListaSolicitacao(payload, usuario, parseInt(tipoAcesso, 10))
      : [];

    return response.ok(pendencias);
  }

  /**
   * Método para receber os dados de uma solicitação para visualização
   * @param request AdonisJs Request Object
   * @param response AdonisJs Response Object
   * @param Session Object :: Dados de usuário gerado pelo Token de sessão :: SuperADM
   */
  async getSolicitacao({ request, response, session }) {
    const usuario = await this._user({ session });
    const { id } = request.allParams();

    const solicitacaoRepository = new SolicitacoesRepository();
    const solicitacaoEntity = new EntitySolicitacao();

    const getThisSolicitacao = new UcGetSolicitacao({
      repository: {
        solicitacaoRepository
      }
    });

    const { payload, error } = await getThisSolicitacao.run({
      id: parseInt(id, 10),
      user: usuario,
    });

    if (error) {
      throw new exception(err, 400);
    }

    const solicitacao = !_.isEmpty(payload)
      ? await solicitacaoEntity.transformGetSolicitacao(payload, usuario)
      : [];

    return response.ok(solicitacao);
  }

  /**
   * Método para efetuar a análise prévia do Funci para determinada vaga.
   * @param request AdonisJs Request Object
   * @param response AdonisJs Response Object
   * @param Session Object :: Dados de usuário gerado pelo Token de sessão :: SuperADM
   */
  async getAnaliseFunci({ request, response, session }) {
    const user = await this._user({ session });
    const { dados } = request.allParams();
    const { origem, destino } = dados;

    const prefixoRepository = new PrefixosRepository();
    const funciRepository = new FuncisRepository();
    const municipioRepository = new MunicipiosRepository();

    const ucGetAnalise = new UcGetAnalise({
      repository: {
        prefixoRepository,
        funciRepository,
        municipioRepository
      }
    });

    const { payload: analise, error } = await ucGetAnalise.run({
      origem,
      destino,
      user
    });

    if (error) {
      throw new exception("Falha ao gerar a análise!", 400);
    }

    return response.ok(analise);
  }

  /**
   * Método para visualizar uma análise realizada e guardada no banco de dados.
   * @param request AdonisJs Request Object
   * @param response AdonisJs Response Object
   */
  async getAnalise({ request, response }) {
    const { id } = request.allParams();

    const analiseRepository = new AnalisesRepository();
    const analiseEntity = new EntityAnalise();
    const ucGetResultadoAnalise = new UcGetResultadoAnalise({
      repository: {
        analiseRepository
      }
    });

    const { payload, error } = await ucGetResultadoAnalise.run({
      id
    });

    if (error) {
      throw new exception(
        "Falha ao recuperar a analise da presente Solicitação!",
        400
      );
    }

    const analise = !_.isEmpty(payload)
      ? await analiseEntity.transformGetResultadoAnalise(payload)
      : [];

    return response.ok(analise);
  }

  /**
   * Método para visualizar uma análise realizada e guardada no banco de dados.
   * @param request AdonisJs Request Object
   * @param response AdonisJs Response Object
   */
  async getConcluidos({ response, session }) {
    const usuario = await this._user({ session });

    const solicitacao = new EntitySolicitacao();

    const solicitacaoRepository = new SolicitacoesRepository();
    const getListaConcluidos = new UcGetListaSolicitacoesConcluidas({
      repository: {
        solicitacaoRepository
      }
    });

    const { payload, error } = await getListaConcluidos.run({
      concluidos: true
    });

    if (error) {
      throw new exception("Falha ao listar as solicitações concluídas!", 400);
    }

    const solicitacoes = !_.isEmpty(payload)
      ? await solicitacao.transformListaSolicitacao(payload, usuario)
      : [];

    return response.ok(solicitacoes);
  }

  /**
   * Método para obter todos os Históricos de uma Solicitação
   * @param request AdonisJs Request Object
   * @param response AdonisJs Response Object
   * @param session Object :: Dados de usuário gerado pelo Token de sessão :: SuperADM
   */
  async getHistorico({ request, response, session }) {
    const usuario = await this._user({ session });
    const { id } = request.allParams();
    const solicitacaoRepository = new SolicitacoesRepository();
    const solicitacaoEntity = new EntitySolicitacao();

    const getThisSolicitacao = new UcGetSolicitacao({
      repository: {
        solicitacaoRepository
      }
    });

    const { payload, error } = await getThisSolicitacao.run({
      id: parseInt(id, 10),
      user: usuario,
    });

    if (error) {
      throw new exception(
        "Falha ao recuperar os dados da presente Solicitação!",
        400
      );
    }

    const historico = !_.isEmpty(payload)
      ? await solicitacaoEntity.transformGetHistorico(payload, usuario)
      : [];

    return response.ok(historico);
  }

  /**
   * Método para obter uma lista de Solicitações, baseado em filtros
   * @param request AdonisJs Request Object
   * @param response AdonisJs Response Object
   * @param session Object :: Dados de usuário gerado pelo Token de sessão :: SuperADM
   */
  async consultas({ request, response, session }) {
    const user = await this._user({ session });
    const { dados } = request.allParams();

    const solicitacao = new EntitySolicitacao();
    const solicitacaoRepository = new SolicitacoesRepository();
    const getListaSolicitacoesFiltradas = new UcConsultas({
      repository: {
        solicitacaoRepository
      }
    });

    const filtroRecebido = _.isObject(dados) ? dados : JSON.parse(dados);

    const filtro = Object.fromEntries(Object.entries(filtroRecebido).filter((elem) => !_.isNil(elem[1])));

    const { payload, error } = await getListaSolicitacoesFiltradas.run({
      filtro,
      user,
    });

    if (error) {
      throw new exception("Falha ao listar as pendências!", 400);
    }

    const pendencias = !_.isEmpty(payload)
      ? await solicitacao.transformListaSolicitacao(payload, user)
      : [];

    return response.ok(pendencias);
  }

  /**
   * Método para obter todos os tipos de históricos (tabela tipos_historico)
   * @param response AdonisJs Response Object
   */
  async getTipoHistoricos({ response }) {
    const tiposHistoricoEntity = new EntityTiposHistorico();
    const tiposHistoricoRepository = new TiposHistoricosRepository();

    const getTiposHistoricos = new UcGetTiposHistorico({
      repository: {
        tiposHistoricoRepository
      }
    });

    const { payload, error } = await getTiposHistoricos.run({
      id: true
    });

    if (error) {
      throw new exception(
        "Falha ao recuperar os dados da presente Solicitação!",
        400
      );
    }

    const tiposHistorico = !_.isEmpty(payload)
      ? await tiposHistoricoEntity.transformOptionsInstancias(payload)
      : [];

    return response.ok(tiposHistorico);
  }

  /**
   * Método para obter o responsável por uma Solicitação
   * @param request AdonisJs Request Object
   * @param response AdonisJs Response Object
   * @param session Object :: Dados de usuário gerado pelo Token de sessão :: SuperADM
   */
  async getResponsavel({ request, response, session }) {
    const user = session.get("currentUserAccount");
    const { id } = request.allParams();
    const solicitacaoRepository = new SolicitacoesRepository();
    const entidadeResponsavel = new EntityResponsavel();

    const ucResponsavel = new UcGetResponsavel({
      repository: {
        solicitacaoRepository
      },
      functions: {
        hasPermission
      }
    });

    const { payload, error } = await ucResponsavel.run({
      id,
      user
    });

    if (error) {
      throw new exception("Falha ao consultar os dados do funcionário!", 400);
    }

    const responsavel = !_.isEmpty(payload)
      ? await entidadeResponsavel.transform(payload, user)
      : [];

    return response.ok(responsavel);
  }

  /**
   * Método para retornar os dados dos tipos de movimentação
   * @param response AdonisJs Response Object
   */
  async loadTipos({ response }) {
    const tiposRepository = new TiposRepository();
    const ucTipos = new UcLoadTipos({
      repository: {
        tiposRepository
      }
    });

    const { payload, error } = await ucTipos.run({
      tipos: true
    });

    if (error) {
      throw new exception("Falha ao consultar os tipos de movimentação!", 400);
    }
    return response.ok(payload);
  }

  /**
   * Calcula as quantidades de dias corridos e úteis
   * @param request AdonisJs Request Object
   * @param response AdonisJs Response Object
   */
  async getQtdeDias({ request, response }) {
    const { dados } = request.allParams();
    const { inicio, fim, prefixo } = JSON.parse(dados);

    const solicitacaoRepository = new SolicitacoesRepository();

    const ucGetQtdeDias = new UcGetQtdeDias({
      repository: {
        solicitacaoRepository
      },
      functions: {
        isFeriadoNacional,
        isFeriadoPrefixo,
        isFinalSemana,
      }
    });

    const { payload, error } = await ucGetQtdeDias.run({
      inicio,
      fim,
      prefixo
    });

    if (error) {
      throw new exception("Falha ao calcular a quantidade de dias!", 400);
    }

    return response.ok(payload);
  }

  /**
   * Calcula se a data informada é útil ou não. Caso não seja, retorna o próximo dia útil
   * @param request AdonisJs Request Object
   * @param response AdonisJs Response Object
   */
  async getDiaUtil({ request, response }) {
    const { dados } = request.allParams();
    const { data, prefixo, quando } = JSON.parse(dados);

    const solicitacaoRepository = new SolicitacoesRepository();

    const ucGetDiasUteis = new UcGetDiasUteis({
      repository: {
        solicitacaoRepository
      },
      functions: {
        isFeriadoNacional,
        isFeriadoPrefixo,
        isFinalSemana,
      }
    });

    const { payload, error } = await ucGetDiasUteis.run({
      data,
      quando,
      prefixo
    });

    if (error) {
      throw new exception("Falha ao verificar se dia informado é útil!", 400);
    }

    return response.ok(payload);
  }

  /**
   * Retorna todos os dias não uteis de um prefixo.
   * @param response AdonisJs Response Object
   * @param Session Object :: Dados de usuário gerado pelo Token de sessão :: SuperADM
   */
  async getDiasNaoUteis({ response, session }) {
    const user = session.get("currentUserAccount");

    const solicitacaoRepository = new SolicitacoesRepository();

    const ucGetDiasNaoUteis = new UcGetDiasNaoUteis({
      repository: {
        solicitacaoRepository
      },
      functions: {
        getFeriadosPrefixo,
        getFeriadosNacionais,
        getFeriadosFixos,
      }
    });

    const { payload, error } = await ucGetDiasNaoUteis.run({
      prefixo: user.prefixo
    });

    if (error) {
      throw new exception("Falha ao verificar os dias não uteis no calendário do BB!", 400);
    }

    return response.ok(payload);
  }

  /**
   * ? Verifica se um determinado funcionário foi solicitado em outro protocolo para as datas informadas.
   * @param request AdonisJs Request Object
   * @param response AdonisJs Response Object
   */
  async getFunciJaSolicitado({ request, response }) {
    const { funci, iniDesig: dataInicial, fimDesig: dataFinal } = request.allParams();
    const solicitacaoRepository = new SolicitacoesRepository();

    const ucGetFunciJaSolicitado = new UcGetFunciJaSolicitado({
      repository: {
        solicitacaoRepository
      }
    });

    const { payload, error } = await ucGetFunciJaSolicitado.run({
      funci,
      dataInicial,
      dataFinal
    });

    if (error) {
      throw new exception("Falha ao receber as solicitações de movimentação do referido funcionário!", 400);
    }

    return response.ok(payload);
  }

  /**
   * Método para calcular e retornar os dados de subordinadas do funci logado
   * @param request AdonisJs Request Object
   * @param response AdonisJs Response Object
   * @param session Object :: Dados de usuário gerado pelo Token de sessão :: SuperADM
   */
  async findDepESubordArh({ request, response, session }) {
    const usuario = await this._user({ session });
    const { prefixo } = request.allParams();
    const prefixoRepository = new PrefixosRepository();

    const ucFindDepESubordArh = new UcFindDepESubordArh({
      repository: {
        prefixoRepository
      },
      functions: {
        getAcessoSuperadm
      }
    });

    const { payload, error } = await ucFindDepESubordArh.run({
      usuario,
      prefixo
    });

    if (error) {
      throw new exception("Falha ao localizar os prefixos subordinados ao prefixo do funcionário logado!", 400);
    }

    return response.ok(payload);
  }

  async getdeAcordo({ request, response, session }) {
    const usuario = await this._user({ session });
    const { id } = request.allParams();
    const deAcordoRepository = new DeAcordoRepository();
    const solicitacaoRepository = new SolicitacoesRepository();

    const ucGetDeAcordo = new UcGetDeAcordo({
      repository: {
        deAcordoRepository,
        solicitacaoRepository
      }
    });

    const { payload, error } = await ucGetDeAcordo.run({
      usuario,
      id
    });

    if (error) {
      throw new exception("Falha ao obter os perfis de De Acordo do funcionário logado!", 400);
    }

    return response.ok(payload);
  }

  async setdeAcordo({ request, response, session }) {
    const user = session.get("currentUserAccount");
    const { id, tipo, texto } = request.allParams();

    const trx = await Database.connection("designacao").beginTransaction();

    const solicitacaoRepository = new SolicitacoesRepository();
    const analiseRepository = new AnalisesRepository();
    const deAcordoRepository = new DeAcordoRepository();
    const documentoRepository = new DocumentosRepository();
    const historicoRepository = new HistoricosRepository();
    const mailRepository = new MailRepository();

    const ucSetDeAcordo = new UcSetDeAcordo({
      repository: {
        solicitacaoRepository,
        analiseRepository,
        deAcordoRepository,
        documentoRepository,
        mailRepository,
        historicoRepository,
      },
      trx
    });

    const { payload, error } = await ucSetDeAcordo.run({
      user,
      id,
      tipo,
      texto: _.isNil(texto) ? ' ' : texto,
    });

    if (error) {
      await trx.rollback();
      throw new exception("Falha ao obter os perfis de De Acordo do funcionário logado!", 400);
    }

    return response.ok(payload);
  }

  async setResponsavel({ request, response, session }) {
    const user = session.get("currentUserAccount");
    const { id } = request.allParams();
    const solicitacaoRepository = new SolicitacoesRepository();
    const documentoRepository = new DocumentosRepository();

    const ucSetResponsavel = new UcSetResponsavel({
      repository: {
        solicitacaoRepository,
        documentoRepository
      }
    });

    const { payload, error } = await ucSetResponsavel.run({
      id,
      user
    });

    if (error) {
      await trx.rollback();
      throw new exception("Falha ao registrar o responsável da solicitação atual!", 400);
    }

    return response.ok({ responsavel: user.chave, funcionarioLogado: user.chave });
  }

  async getDocumento({ request, response }) {
    const { id_solicitacao, documento } = request.allParams();
    const DESIGINTPATH = "uploads/Designacao";

    const filePath = `${DESIGINTPATH}/${id_solicitacao}/${documento}`;

    try {
      response.download(filePath);
    } catch (err) {
      throw new exception(err, 400);
    }
  }

  async setDocumento({ request, response, session }) {
    try {
      const user = session.get("currentUserAccount");

      const arquivos = this._getFiles(request);

      const {
        id_solicitacao,
        id_historico,
        texto,
        id_negativa,
        tipo,
      } = request.all();

      let documentos;

      if (["17", "20", "21", "22", "23", "24", "25"].includes(id_historico)) {
        documentos = await setEncaminhar(
          { id_solicitacao, id_historico, texto: _.isNil(texto) ? ' ' : texto, id_negativa, tipo },
          arquivos,
          user
        );
      } else if (["26", "27", "28", "30"].includes(id_historico)) {
        documentos = await setConcluir(
          { id_solicitacao, id_historico, texto: _.isNil(texto) ? ' ' : texto, id_negativa, tipo },
          arquivos,
          user
        );
      } else {
        documentos = await setDocumento(
          { id_solicitacao, id_historico, texto: _.isNil(texto) ? ' ' : texto, id_negativa, tipo },
          arquivos,
          user
        );
      }

      if (!documentos) {
        response.badRequest("Problema ao gravar o Parecer.").send();
      }

      response.ok(documentos);
    } catch (error) {
      throw new exception("Falha ao gravar os arquivos.", 400);
    }
  }

  async getNegativas({ response }) {
    try {
      const negativas = await Negativa.all();

      if (!negativas) {
        response
          .badRequest("Problema ao receber a lista das negativas.")
          .send();
      }

      response.ok(negativas);
    } catch (error) {
      throw new exception("Falha ao receber a lista das negativas!", 400);
    }
  }

  async getTipoAcesso({ response, session }) {
    try {
      const user = session.get("currentUserAccount");

      const tipo = await getTipoAcesso(user);

      if (!tipo) {
        response.badRequest("Problema ao receber o tipo de acesso.").send();
      }

      response.ok(tipo);
    } catch (error) {
      throw new exception(
        "Falha ao receber os dados do funcionário logado!",
        400
      );
    }
  }

  async getTipoHistorico({ request, response, session }) {
    try {
      const user = session.get("currentUserAccount");

      const { acesso, id_solicitacao, consulta } = request.allParams();

      const historicos = await getTipoHistorico(
        acesso,
        id_solicitacao,
        consulta,
        user
      );

      if (!historicos) {
        response
          .badRequest("Problema ao receber a lista dos tipos de histórico.")
          .send();
      }

      response.ok(historicos);
    } catch (error) {
      throw new exception(
        "Falha ao receber a lista dos tipos de históricos!",
        400
      );
    }
  }

  async getTipoHistoricoById({ request, response, session }) {
    try {
      const user = session.get("currentUserAccount");

      const acesso = await getPermissao(user, "Designação Interina", [
        "REGISTRO",
      ]);

      if (!acesso) {
        throw new exception(
          "Funcionário não possui acesso a esta opção!",
          400
        );
      }

      const { id } = request.allParams();

      const historicos = await TipoHistorico.find(id);

      if (!historicos) {
        response
          .badRequest("Problema ao receber a lista dos tipos de histórico.")
          .send();
      }

      response.ok(historicos.toJSON());
    } catch (error) {
      throw new exception(
        "Falha ao receber a lista dos tipos de históricos!",
        400
      );
    }
  }

  async getTodosTiposHistoricos({ request, response, session }) {
    try {
      const user = session.get("currentUserAccount");

      const acesso = await getPermissao(user, "Designação Interina", [
        "REGISTRO",
      ]);

      if (!acesso) {
        throw new exception(
          "Funcionário não possui acesso a esta opção!",
          400
        );
      }

      const historicos = await TipoHistorico.all();

      if (!historicos) {
        response
          .badRequest("Problema ao receber a lista dos tipos de histórico.")
          .send();
      }

      response.ok(historicos.toJSON());
    } catch (error) {
      throw new exception(
        "Falha ao receber a lista dos tipos de históricos!",
        400
      );
    }
  }

  async setFilesNegativas({ request, response, session }) {
    try {
      const user = session.get("currentUserAccount");

      const { id_solicitacao, id_historico, texto, negativa } = request.all();

      const arquivos = request.file("files", {
        types: ["image", "pdf"],
        size: "5mb",
      });

      let textoFinal;
      if (negativa === "limitrofes") {
        texto = JSON.parse(texto);
        textoFinal = `Envio de Documentos (${texto["tipo"]})\n
                         ${texto["tipo"]} - ${texto.tipoDesloc === 1
            ? texto.dias_totais > 1
              ? texto.dias_totais + " dias"
              : texto.dias_totais + " dia"
            : texto.dias_uteis > 1
              ? texto.dias_uteis + " dias"
              : texto.dias_uteis + " dia"
          }\n
                         Deslocamento: ${texto["tipoDesloc"] === 1
            ? texto["desloc"].toLocaleString("PT-br", {
              style: "currency",
              currency: "BRL",
            })
            : texto["desloc"] +
            " x " +
            texto.dias_uteis +
            " = " +
            (
              texto["desloc"] * texto.dias_uteis
            ).toLocaleString("PT-br", {
              style: "currency",
              currency: "BRL",
            })
          },\n
                         Alimentação : ${texto["alim"].toLocaleString("PT-br", {
            style: "currency",
            currency: "BRL",
          })} x ${texto["tipoDesloc"] === 1
            ? texto.dias_totais + " (dias totais)"
            : texto.dias_uteis + " (dias úteis"
          } = ${texto["tipoDesloc"] === 1
            ? (texto["alim"] * texto.dias_totais).toLocaleString("PT-br", {
              style: "currency",
              currency: "BRL",
            })
            : (texto["alim"] * texto.dias_uteis).toLocaleString("PT-br", {
              style: "currency",
              currency: "BRL",
            })
          }
                         ${texto["tipoDesloc"] === 1
            ? ",\nHospedagem  : " +
            texto["hosped"].toLocaleString("PT-br", {
              style: "currency",
              currency: "BRL",
            }) +
            " x " +
            texto.dias_totais +
            " = " +
            (
              texto["hosped"] * texto.dias_totais
            ).toLocaleString("PT-br", {
              style: "currency",
              currency: "BRL",
            })
            : "."
          }\n
                         ${texto.limitrofesMotivo &&
          "Qual(is) o(s) motivo(s) de não indicação de funcionário(s) da própria agência ou de agência em município limítrofe? " +
          texto.limitrofesMotivo +
          "\n"
          }
                         ${texto.limitrofesOrient &&
          "O(s) funcionário(s) da própria agência recebe(m) orientação(ões) para se capacitar(em)? " +
          texto.limitrofesOrient +
          "\n"
          }
                         ${texto.limitrofesLimit &&
          "Informar as agências LIMÍTROFES: " +
          texto.limitrofesLimit +
          "\n"
          }
                         ${texto.limitrofesDistL &&
          "Qual distância entre a(s) agência(s) LIMÍTROFE(S) e a agência DESTINO? " +
          texto.limitrofesDistL +
          "\n"
          }
                         ${texto.limitrofesDific &&
          "Há dificuldade quanto ao transporte de funcionários da(s) agência(s) LIMÍTROFE(S)? " +
          texto.limitrofesDific +
          "\n"
          }
                         ${texto.limitrofesAusenc &&
          "Há ausências de funcionários de agências LIMÍTROFES para o período de adição/designação interina? " +
          texto.limitrofesAusenc +
          "\n"
          }
                         ${texto.limitrofesDistNL &&
          "Qual a distância entre a agência NÃO LIMÍTROFE e a agência DESTINO? " +
          texto.limitrofesDistNL +
          "\n"
          }`;
      } else {
        textoFinal = `Envio de Documentos (${dados.analise.analise[elem].label})\n
                       ${texto}`;
      }

      let documentos = await setDocumento(
        { id_solicitacao, id_historico, texto: textoFinal, tipo },
        arquivos,
        user
      );

      if (!documentos) {
        response.badRequest("Problema ao gravar o Parecer.").send();
      }

      response.ok(documentos);
    } catch (error) {
      throw new exception("Falha ao gravar os arquivos.", 400);
    }
  }

  async getSituacoes({ response }) {
    try {
      const situacoes = await getSituacoes();

      if (!situacoes) {
        response
          .badRequest(
            "Problema ao receber a lista das possíveis situações de uma solicitação."
          )
          .send();
      }

      response.ok(situacoes);
    } catch (error) {
      throw new exception(
        "Falha ao receber a lista das possíveis situações de uma solicitação!",
        400
      );
    }
  }

  async getStatus({ response }) {
    try {
      const status = await getStatus();

      if (!status) {
        response
          .badRequest(
            "Problema ao receber a lista dos possíveis status de uma solicitação."
          )
          .send();
      }

      response.ok(status);
    } catch (error) {
      throw new exception(
        "Falha ao receber a lista dos possíveis status de uma solicitação!",
        400
      );
    }
  }

  async getProtocolo({ request, response, session }) {
    try {
      const user = session.get("currentUserAccount");

      const { protocolo } = request.allParams();

      const protocolos = await getProtocolos(protocolo, user);

      if (!protocolos) {
        response
          .badRequest(
            "Problema ao receber os dados da consulta por protocolos."
          )
          .send([]);
      }

      response.ok(protocolos);
    } catch (error) {
      throw new exception(
        "Falha ao receber os dados da consulta por protocolos!",
        400
      );
    }
  }


  async setConcluir({ request, response, session }) {
    try {
      const user = session.get("currentUserAccount");
      const { id } = request.all();

      const concluidos = await setConcluir(id, user);

      if (!concluidos) {
        response
          .badRequest(
            "Problema ao marcar a presente solicitação como CONCLUÍDA."
          )
          .send();
      }

      response.ok(concluidos);
    } catch (error) {
      throw new exception(
        "Falha ao marcar a presente solicitação como CONCLUÍDA!",
        400
      );
    }
  }

  async compareVRDestOrig({ request, response }) {
    try {
      const { funci, fn_dest } = request.allParams();

      let dadosFunciOrig = await getOrigem({ funci });
      let dadosFnOrig = {};

      if (
        dadosFunciOrig.funcao_lotacao === "00610" ||
        dadosFunciOrig.funcao_lotacao === "00288" ||
        dadosFunciOrig.funcao_lotacao === "00394"
      ) {
        dadosFnOrig.valor_referencia = "0.0";
      } else {
        dadosFnOrig = await getDadosComissao(dadosFunciOrig.funcao_lotacao);
      }
      let dadosFnDest = await getDadosComissao(fn_dest);

      if (!dadosFnDest || !dadosFnOrig) {
        response
          .badRequest("Problema ao comparar os valores de referência.")
          .send();
      }

      response.ok(
        parseFloat(dadosFnDest.valor_referencia) >=
        parseFloat(dadosFnOrig.valor_referencia)
      );
    } catch (error) {
      throw new exception("Falha ao comparar os valores de referência!", 400);
    }
  }

  async getTemplates({ request, response }) {
    try {
      const { id, id_tipo_historico, valido } = request.allParams();

      const template = await getTemplate({ id, id_tipo_historico, valido: valido || 1 });

      if (!template) {
        response.badRequest("Problema ao receber os dados do template.").send();
      }

      response.ok(template);
    } catch (error) {
      throw new exception("Falha ao buscar templates!", 400);
    }
  }

  async getAllTemplates({ request, response, session }) {
    try {
      const user = session.get("currentUserAccount");
      const { valido } = request.allParams();

      const acesso = await getPermissao(user, "Designação Interina", [
        "REGISTRO",
      ]);

      if (!acesso) {
        throw new exception("Usuário não possui acesso suficiente!", 400);
      }

      let templates = await getTemplate({ valido: parseInt(valido) });

      response.ok(templates);

    } catch (error) {
      throw new exception("Falha ao buscar templates!", 400);
    }
  }

  async setTemplate({ request, response, session }) {
    try {
      const user = session.get("currentUserAccount");
      const { id, id_tipo_historico, curto, texto, excluir } = request.allParams();

      const acesso = await getPermissao(user, "Designação Interina", [
        "REGISTRO",
      ]);

      if (!acesso) {
        throw new exception("Usuário não possui acesso suficiente!", 400);
      }

      const template = await setTemplate({ id, id_tipo_historico, curto, texto, excluir, user });

      if (!template) {
        response.badRequest("Problema ao receber os dados do template.").send();
      }

      response.ok(template);
    } catch (error) {
      throw new exception("Falha ao buscar templates!", 400);
    }
  }

  /**
   * Aplicando o lock para dois funcionários não acessarem o mesmo registro ao mesmo tempo (válido para movimentação e registro)
   */

  async getLock({ request, response, session }) {
    try {
      const user = session.get("currentUserAccount");
      const { id_solicitacao } = request.all();

      const lock = await Lock.findBy("id_solicitacao", id_solicitacao);

      if (lock.id) {
        response.ok({ locked: true });
      } else {
        response.ok({ locked: false });
      }
    } catch (error) {
      throw new exception(
        "Falha ao obter os dados da trava da solicitação!",
        400
      );
    }
  }

  // ! Incompleto
  async setLock({ session, response, request }) {
    try {
      const user = session.get("currentUserAccount");
      const { id_solicitacao } = request.allParams();

      const lock = await Lock.findBy("id_solicitacao", id_solicitacao);

      if (!lock.id) {
        lock.id = id_solicitacao;
        lock.funci = user.matricula;
        lock.datetime = moment();
        lock.save();
        response.ok({ lock: lock.id });
      } else {
        response.ok(concluidos);
      }
    } catch (error) {
      throw new exception(
        "Falha ao marcar a presente solicitação como CONCLUÍDA!",
        400
      );
    }
  }

  async exportaConsulta({ request, response, session, transform }) {
    try {
      const user = session.get("currentUserAccount");
      let { dados } = request.allParams();

      dados = JSON.parse(dados);
      const consultas = await getConsultas(dados, user);

      const consultasTransformed = !_.isEmpty(consultas) ? await transform.collection(
        consultas,
        "Designacao/SolicitacaoTransformer.exportaExcel"
      ) : [];

      const headers = [
        { key: "protocolo", header: "Protocolo" },
        { key: "tipo", header: "Tipo Movimentação" },
        { key: "prefixo_origem", header: "Prefixo Origem" },
        { key: "nome_prefixo_origem", header: "Nome Prefixo Origem" },
        { key: "prefixo_destino", header: "Prefixo Destino" },
        { key: "nome_prefixo_destino", header: "Nome Prefixo Destino" },
        { key: "limitrofes", header: "Limítrofes" },
        { key: "funcao_destino", header: "Função Destino" },
        { key: "nome_funcao_destino", header: "Nome Função Destino" },
        { key: "matricula_origem", header: "Funcionário Indicado" },
        { key: "funci_origem", header: "Nome Funcionário Indicado" },
        { key: "matricula_solicitacao", header: "Funcionário Solitante" },
        { key: "funci_solicitacao", header: "Nome Funcionário Solitante" },
        { key: "requisitos", header: "Requisitos Cumpridos" },
        { key: "status", header: "Status" },
        { key: "situacao", header: "Situação" },
        { key: "responsavel", header: "Responsável" },
        { key: "nome_responsavel", header: "Nome Responsável" },
        { key: "dt_solicitacao", header: "Data Solicitação" },
        { key: "dt_ini", header: "Data Início" },
        { key: "dt_fim", header: "Data Fim" },
      ];

      let arquivoExportado = await JsonExport.convert({
        dadosJson: consultasTransformed,
        headers,
        headerTitle: `Movimentação Temporária - Consulta`,
        type: "xls",
      });

      await JsonExport.download(response, arquivoExportado);
    } catch (error) {
      throw new exception("Falha ao consultar os dados das solicitações!", 400);
    }
  }

  async acessoTeste({ request, response, session }) {
    try {
      const user = session.get("currentUserAccount");
      const { acesso } = request.allParams();

      let SUPER = await Designacao.query()
        .distinct("super")
        .table("prefixos_teste")
        .fetch();

      if (!SUPER) {
        response
          .badRequest("Problema ao obter os prefixos de Super Estaduais.")
          .send();
      }

      SUPER = SUPER.toJSON();
      SUPER = SUPER.map((prefixo) => prefixo.super);

      let GEREV = await Designacao.query()
        .distinct("gerev")
        .table("prefixos_teste")
        .fetch();

      if (!GEREV) {
        response
          .badRequest("Problema ao obter os prefixos de Super Regionais.")
          .send();
      }

      GEREV = GEREV.toJSON();
      GEREV = GEREV.map((prefixo) => prefixo.gerev);

      const acessoInicial = await getPermissao(user, "Designação Interina", [
        "ACESSO_TESTE",
      ]);

      let acessoFinal = acessoInicial;

      if (!acessoFinal && acesso === "ACESSO_TESTE") {
        if (SUPER.includes(user.pref_super)) {
          if (
            GEREV.includes(user.pref_regional) ||
            SUPER.includes(user.prefixo)
          ) {
            acessoFinal = true;
          }
        }
      }

      response.ok(acessoFinal);
    } catch (error) {
      throw new exception("Acesso não autorizado!", 400);
    }
  }

  /**
   * Aplicando o lock para dois funcionários não acessarem o mesmo registro ao mesmo tempo (válido para movimentação e registro)
   */

  async getPrefSubord({ request, response, session }) {
    const user = session.get("currentUserAccount");

    const prefixos = [{ prefixo: user.prefixo, nome: user.dependencia }];

    response.ok(prefixos);
  }

  /**
   * Busca os funcis lotados em uma funcao, em um prefixo.
   */
  async findMatchedFuncisLotados({ session, request, response }) {
    try {
      let { prefixo, comissao } = request.allParams();

      if (!prefixo) {
        const usuario = session.get("currentUserAccount");
        prefixo = usuario.prefixo;
      }

      let dotacao = await getMatchedFuncisLotados(prefixo, comissao);

      response.ok(dotacao);
    } catch (error) {
      throw new exception("Falha ao verificar os funcionários lotados!", 400);
    }
  }

  /**
   * Busca os funcis lotados em uma funcao, em um prefixo, mas que estão movimentados
   */
  async findMatchedFuncisMovimentados({ session, request, response }) {
    try {
      let { prefixo, comissao } = request.allParams();

      if (!prefixo) {
        const usuario = session.get("currentUserAccount");
        prefixo = usuario.prefixo;
      }

      let dotacao = await getMatchedFuncisMovimentados(prefixo, comissao);

      response.ok(dotacao);
    } catch (error) {
      throw new exception("Falha ao verificar os funcionários movimentados!", 400);
    }
  }

  /**
   * Busca a dotação de um prefixo, retornando apenas as funções com dotação > 0
   */
  async findDotacaoDependencia({ session, request, response }) {
    try {
      let { prefixo, ger, gest } = request.allParams();

      if (!prefixo) {
        const usuario = session.get("currentUserAccount");
        prefixo = usuario.prefixo;
      }

      ger = ger === "true" || false;
      gest = gest === "true" || false;

      let dotacao = await getDotacaoDependencia(prefixo, ger, gest);

      response.ok(dotacao);
    } catch (error) {
      throw new exception("Falha ao verificar a dotação da dependência!", 400);
    }
  }

  /**
   * teste para carregar o primeiro gestor dos prefixos informados
   */

  async testGetPrimGestor({ request, response }) {
    let gestor = await MailLog().query().insert({
      id_gedip: 1,
      campo_de:
        "17641473569183475619375619875469128475619487569487562389475629384756298745629",
      campo_para:
        "asidjfoirugfor987nklnurigfvhwiurghiugrvhlklsbkurvygskluhysvirtueysvt",
    });

    if (!gestor) {
      response.notFound("Teste error!");
    }

    response.ok(gestor);
  }

  async teste({ response }) {
    let prefixo = "2636";

    /*

    SELECT t1.*
    FROM app_designacao.solicitacoes t1
    WHERE id_status = 1
    AND concluido = 0
    AND (
      ( (t1.pref_orig IN ('2636') OR t1.pref_dest IN ('2636'))  AND t1.id_situacao = 1)

        OR (t1.encaminhado_para ='2636' AND NOT t1.id_situacao IN (1,5,6))
      )

    */
    //  ? teste em 10 08 2020
    /**
     * testar factory para recuperar a função que resolve o grupo de pendẽncias sem usar o switch/case
     */

    const tester = {
      1: (builder) => {
        builder
          .where((bld1) => {
            bld1
              .where((builderPref) => {
                builderPref //(t1.pref_orig IN ('2636') OR t1.pref_dest IN ('2636'))
                  .whereIn("pref_orig", [prefixo])
                  .orWhereIn("pref_dest", [prefixo]);
              })
              .where("id_situacao", 1); //AND t1.id_situacao = 1)
          })
          .orWhere((bld2) => {
            bld2
              .whereIn("encaminhado_para", [prefixo]) //t1.encaminhado_para ='2636'
              .whereNotIn("id_situacao", [1, 5, 6]); //AND NOT t1.id_situacao IN (1,5,6)
          });
      },
    };

    let pendentes = await Solicitacao.query()
      .where("id_status", 1)
      .where("concluido", 0)

      .where(tester["1"])

      // .where(builder => {
      //   builder
      //     .where(bld1 => {
      //       bld1.where(builderPref => {
      //         builderPref //(t1.pref_orig IN ('2636') OR t1.pref_dest IN ('2636'))
      //           .whereIn('pref_orig', [prefixo])
      //           .orWhereIn('pref_dest', [prefixo])
      //       })
      //         .where('id_situacao', 1)  //AND t1.id_situacao = 1)
      //     })
      //     .orWhere(bld2 => {
      //       bld2
      //         .whereIn('encaminhado_para', [prefixo]) //t1.encaminhado_para ='2636'
      //         .whereNotIn('id_situacao', [1, 5, 6]) //AND NOT t1.id_situacao IN (1,5,6)
      //     })
      // })
      .fetch();

    response.send(pendentes);
  }

  // teste getperfilfunci
  async testes({ request, response, session }) {
    // return;
    try {
      const user = session.get("currentUserAccount");

      const all = request.allParams();

      const nmTeste = parseInt(all.teste + "");

      switch (nmTeste) {
        case 1:
          /** teste de perfil de usuário */
          const perfil = await getPerfilFunci(user, all.id_solicitacao);
          response.ok(perfil);
          break;
        case 2:
          /** Teste de data */
          const momento = "15/12/2020";
          response.ok(
            moment(momento)
              .hour(5)
              .minute(0)
              .second(0)
              .format("YYYY-MM-DD HH:mm:ss")
          );
          break;
        case 3:
          /** teste email madrinha */
          const { prefixo } = request.allParams();
          let destination = [];
          const madrinha = await getPrefixoMadrinha(prefixo);
          const prefMadrinha = await getOneDependencia(madrinha.prefixo);
          destination.push(await getMainEmail(prefMadrinha.uor));
          response.ok(destination.toString);
          break;
        case 4:
          let uor = await Uors500g.findBy("CodigoUOR", "000027719");
          response.ok(uor.toJSON());
          break;
        case 5:
          let funci = await Funci.query()
            .with("uorTrabalho")
            .with("uor500g")
            .where("matricula", "F4683333")
            .first();
          response.ok(funci.toJSON());
        case 6:
          /** teste de perfil de usuário */
          const actualPerfil = await getActualFunciProfile(
            all.id_solicitacao,
            user
          );
          response.ok(actualPerfil);
          break;
        case 7:
          // const primGestor = await getPrimeiroGestorPorPrefixo(all.prefixo, all.uor_trabalho);
          const primGestor = await getPrimGestor(all.prefixo, all.regional);
          response.ok(primGestor);
        default:
          return -1;
      }
    } catch (error) {
      throw new exception("teste com falha");
    }
  }

  // verifica se houve a assinatura de todos os acordantes da solicitação
  async checaDeAcordo({ request, response, session }) {
    try {
      const user = session.get("currentUserAccount");
      const { id_solicitacao } = request.allParams();

      const acordo = await setDeAcordo(id_solicitacao, user);

      response.ok(acordo);
    } catch (error) {
      throw new exception("teste do getPerfilFunci com falha");
    }
  }

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

  async getAusProgr({ request, response }) {
    const { matricula } = request.allParams();
    const funciRepository = new FuncisRepository();

    const ucGetAusProgrPorFunci = new UcGetAusProgrPorFunci({
      repository: {
        funciRepository
      }
    });

    const { payload, error } = await ucGetAusProgrPorFunci.run({
      matricula
    });

    if (error) {
      throw new exception("Falha ao receber as ausências programadas do funcionário!", 400);
    }

    return response.ok(payload);
  }

  async getPrefixosTeste({ response }) {
    const user = null;
    const prefsTesteRepository = new PrefixosTesteRepository();

    const ucGetPrefixosTeste = new UcGetPrefixosTeste({
      repository: {
        prefsTesteRepository
      }
    });

    const { payload, error } = await ucGetPrefixosTeste.run({ user });

    if (error) {
      throw new exception("Falha ao receber os prefixos de teste!", 400);
    }

    return response.ok(payload);
  }

  async _user({ session }) {
    const user = session.get("currentUserAccount");

    const usuario = await getPerfilFunci(user);
    usuario.user.isUN = await isPrefixoUN(user.prefixo);
    usuario.user.isGerev = await isUsuarioPrefixoGerev(user);
    usuario.user.isSupAdm = isPrefixoSuperAdm(user.prefixo);
    usuario.user.isPlataformaSuperAdm = user.isSupAdm ? await getGerevsPlataforma(user) : [false, null];
    usuario.user.isDIVAR = user.prefixo === PREFIXO_DIVAR;
    usuario.user.isDIRAV = user.prefixo === PREFIXO_DIRAV;
    usuario.acessos = await getTipoAcesso(user);

    return usuario;
  }
}

module.exports = DesignacaoController;
