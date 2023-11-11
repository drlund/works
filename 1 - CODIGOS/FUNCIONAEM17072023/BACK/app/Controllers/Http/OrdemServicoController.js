'use strict'
const ordemModel = use('App/Models/Mysql/OrdemServ/Ordem');
const ordemHistoricoModel = use('App/Models/Mysql/OrdemServ/Historico');
const tipoVinculoModel = use('App/Models/Mysql/OrdemServ/TipoVinculo');
const participanteExpandidoModel = use('App/Models/Mysql/OrdemServ/ParticipanteExpandido');
const participanteEdicaoModel = use('App/Models/Mysql/OrdemServ/ParticipanteEdicao');
const colaboradorModel = use('App/Models/Mysql/OrdemServ/Colaborador');
const autorizacaoConsultaModel = use('App/Models/Mysql/OrdemServ/AutorizacaoConsulta');
const estadoModel = use('App/Models/Mysql/OrdemServ/Estado');
const registrarHistorico = use('App/Commons/OrdemServ/registrarHistorico');
const naoPassivelAssinatura = use('App/Commons/OrdemServ/naoPassivelAssinatura');
const { getOneFunci, isComissaoNivelGerencial, getDadosComite } = use("App/Commons/Arh");
const incRestritaModel = use('App/Models/Mysql/OrdemServ/IncRestrita');
const exception = use('App/Exceptions/Handler');
const Database = use('Database')
const _ = require('lodash');
const moment = use('App/Commons/MomentZoneBR');
const md5 = require("md5");
const RotinaVerificacaoNoturna = require('../../Commands/ordemserv/RotinaVerificacaoNoturna');
const { validate } = use('Validator')
const { OrdemServConsts } = use('Constants')
const { ESTADOS, TIPO_PARTICIPACAO, EVENTOS_HISTORICO,
  TIPO_VINCULO, TIPO_VOTACAO_COMITE } = OrdemServConsts;
const { isDesignante, isDesignado, getListaParticipantes,
  registrarAtividadeAplicacao, removeRegistroAtividadeAplicacao } = use('App/Commons/OrdemServ/OrdemServUtils');
const { expandirParticipantes } = use('App/Commons/OrdemServ/expandirParticipantes');
const { notificarDesignantes, notificarDesignados, notificarRevogacao, notificarSolicitacaoCienciaParticipante } = use('App/Commons/OrdemServ/notificarParticipantes');
const baseIncUtils = use('App/Commons/BaseIncUtils')

/**
 * Classe principal do controller das Ordens de Serviço.
 */
class OrdemServicoController {

  /**
   * Obtem a lista de ordens de servico do usuario logado a partir de um estado especifico.
   */
  async findByEstadoDaOrdem({ request, response, session, transform }) {

    const dadosUsuario = session.get('currentUserAccount');
    const filtroEstadoDaOrdem = request.allParams().filtroEstadoDaOrdem;
    const TODAS = "0";

    //todas as ordens que o usuario eh designante | designado
    let queryParticipante = participanteExpandidoModel
      .query()
      .with('participanteEdicao.ordem', (builder) => {
        builder.with('estado');
        builder.with('instrucoesNormativas', insNormBuilder => {
          insNormBuilder.setVisible(['sofreu_alteracao'])
        })
      })
      .where('matricula', dadosUsuario.chave)

    //todas as ordens que o usuario eh colaborador
    let queryColaborador = colaboradorModel
      .query()
      .with('ordem', (builder) => {
        builder.with('estado')
          .with('instrucoesNormativas', insNormBuilder => {
            insNormBuilder.setVisible(['sofreu_alteracao'])
          })
      })
      .where('matricula', dadosUsuario.chave);

    //todas as ordens que o usuario tem autorizacao de consulta
    //ordens que ele não participa mas foi autorizado a visualizar
    let queryAutorizacoesConsulta = autorizacaoConsultaModel
      .query()
      .with('ordem', (builder) => {
        builder.with('estado')
          .with('instrucoesNormativas', insNormBuilder => {
            insNormBuilder.setVisible(['sofreu_alteracao'])
          })
      })
      .where('matricula', dadosUsuario.chave);

    //todas as ordens que sao o designante eh da mesma dependencia e o usuario NAO eh
    //designante nem designado, funci possui nivel gerencial e as ordens não são confidenciais.
    let queryDependencia = participanteEdicaoModel
      .query()
      .with('ordem', (builder) => {
        builder.with('estado')
      })
      .whereHas('participanteExpandido', builder => {
        //matricula nao estar na participante expandido
        builder.whereNot('matricula', dadosUsuario.chave)
      })

      //ordens do mesmo prefixo
      .where('prefixo', dadosUsuario.prefixo)
      //matricula nao estar na ordem edicao
      .whereNot('matricula', dadosUsuario.chave)
      //ordens nao confidenciais
      .whereHas('ordem', builder => {
        builder.where('confidencial', 0)
      })
      .where('tipo_participacao', TIPO_PARTICIPACAO.DESIGNANTE);

    if (!filtroEstadoDaOrdem.includes(TODAS)) {
      //permite pesquisar todas inclusive as revogadas ou excluidas, caso seja marcada a opcao intencionalmente.
      queryParticipante.whereHas('participanteEdicao.ordem.estado', (builder) => {
        builder.whereIn('id', filtroEstadoDaOrdem)
      });

      queryColaborador.whereHas('ordem.estado', (builder) => {
        builder.whereIn('id', filtroEstadoDaOrdem)
      });

      queryAutorizacoesConsulta.whereHas('ordem.estado', (builder) => {
        builder.whereIn('id', filtroEstadoDaOrdem)
      });

      queryDependencia.whereHas('ordem.estado', (builder) => {
        builder.whereIn('id', filtroEstadoDaOrdem)
          .whereNotIn('id', [ESTADOS.RASCUNHO])
      });
    } else {
      //nao lista as ordens excluidas e nem revogadas na opcao TODAS
      let EstadosExcluir = [ESTADOS.EXCLUIDA, ESTADOS.REVOGADA];

      queryParticipante.whereHas('participanteEdicao.ordem.estado', (builder) => {
        builder.whereNotIn('id', EstadosExcluir)
      });

      queryColaborador.whereHas('ordem.estado', (builder) => {
        builder.whereNotIn('id', EstadosExcluir)
      });

      queryAutorizacoesConsulta.whereHas('ordem.estado', (builder) => {
        builder.whereNotIn('id', EstadosExcluir)
      });

      queryDependencia.whereHas('ordem.estado', (builder) => {
        builder.whereNotIn('id', [...EstadosExcluir, ESTADOS.RASCUNHO])
      });
    }

    let retornoParticipante = await queryParticipante.fetch()
    let retornoColaborador = await queryColaborador.fetch()
    let retornoAutorizacoesConsulta = await queryAutorizacoesConsulta.fetch()
    let retornoDependencia = await queryDependencia.fetch()

    retornoParticipante = retornoParticipante.toJSON()
    retornoColaborador = retornoColaborador.toJSON()
    retornoAutorizacoesConsulta = retornoAutorizacoesConsulta.toJSON()
    retornoDependencia = retornoDependencia.toJSON()

    const retornoParticipanteTransformado = await transform.collection(retornoParticipante, 'ordemserv/OrdensAtuaisParticipanteTransformer')
    const retornoColaboradorTransformado = await transform.collection(retornoColaborador, 'ordemserv/OrdensAtuaisColaboradorTransformer')
    const retornoAutConsultaTransformado = await transform.collection(retornoAutorizacoesConsulta, 'ordemserv/OrdensAtuaisColaboradorTransformer.autorizacaoConsulta')
    let retornoDependenciaTransformado = await transform.collection(retornoDependencia, 'ordemserv/OrdensAtuaisDependenciaTransformer')

    //flag indicativo se o funci possui nivel gerencial
    let possuiNivelGerencial = await isComissaoNivelGerencial(dadosUsuario.cod_funcao)

    if (!possuiNivelGerencial) {
      //exlui as ordens da dependencia para usuario sem nivel gerencial.
      retornoDependenciaTransformado = []
    }

    let retornoConcatenado = retornoParticipanteTransformado.concat(retornoColaboradorTransformado, retornoDependenciaTransformado, retornoAutConsultaTransformado);

    //remove duplicatas, caso existam
    retornoConcatenado = _.uniqBy(retornoConcatenado, 'id_ordem');

    const retorno = retornoConcatenado.map((elem) => {
      return {
        ...elem,
        //a key das linhas da tabela deve ser unico e coincidir com o id da ordem
        key: elem.id_ordem,
        isNivelGerencial: possuiNivelGerencial
      }
    })

    response.send(retorno)

  }

  /**
   * Obtem o historico pessoal do usuario logado em todas as ordens
   * que este já participou como designante, designado ou colaborador.
   */
  async findHistoricoPessoal({ response, session, transform }) {

    const dadosUsuario = session.get('currentUserAccount')

    //obtem os ids unicos das ordens revogadas que o usuario já participou
    let idsOrdens = await ordemHistoricoModel.query()
      .where('matricula_participante', dadosUsuario.chave)
      .with('ordem')
      .whereHas('ordem', (builder) => {
        builder.where('id_estado', ESTADOS.REVOGADA)
      })
      .setVisible(['id_ordem'])
      .distinct(['id_ordem'])
      .fetch();

    idsOrdens = idsOrdens.toJSON();
    idsOrdens = _.map(idsOrdens, 'id_ordem');

    const eventosRevogacao = [
      EVENTOS_HISTORICO.SAIU_ORDEM_POR_MUD_PREF,
      EVENTOS_HISTORICO.REVOGOU_ORDEM,
      EVENTOS_HISTORICO.REMOVIDO_POR_ALTERACAO_ORDEM,
      EVENTOS_HISTORICO.REMOVIDO_POR_REVOGACAO_ORDEM,
      EVENTOS_HISTORICO.REMOVIDO_POR_FINAL_VIGENCIA,
      EVENTOS_HISTORICO.REMOVIDO_POR_ALTERACAO_NA_INC,
      EVENTOS_HISTORICO.CONFIRMOU_ALTERACAO_DAS_INC
    ];

    let retorno = await ordemHistoricoModel
      .query()
      .with('evento')
      .with('ordem', (builder) => {
        builder.setVisible(['id', 'numero', 'data_vig_ou_revog', 'titulo'])
      })
      .where('matricula_participante', dadosUsuario.chave)
      .setVisible(['id', 'data_evento', 'tipo_participacao'])
      .whereIn('id_ordem', idsOrdens)
      .whereIn('id_evento', eventosRevogacao)
      .groupBy('id_ordem')
      .fetch();

    retorno = retorno.toJSON();
    retorno = await transform.collection(retorno, "ordemserv/GetHistoricoPessoalTransformer");
    response.send(retorno)
  }

  /**
   * Metodo que busca todo o historico registrado de uma ordem especifica.
   */
  async findHistoricoOrdem({ request, response, transform }) {
    const { id } = request.allParams();

    if (!id) {
      throw new exception("Identificador da ordem não informado!", 400);
    }

    let registrosHistorico = await ordemHistoricoModel
      .query()
      .with('evento')
      .with('dadosParticipante')
      .with('ordem', (builder) => {
        builder.setVisible(['id', 'numero', 'data_vig_ou_revog', 'titulo', 'tipo_validade', 'data_validade'])
          .with('estado')
      })
      .setHidden(['dados_ordem', 'hash_ordem', 'endereco_ip', 'token_intranet'])
      .where('id_ordem', id)
      .orderBy('data_evento', 'asc')
      .fetch();

    registrosHistorico = registrosHistorico.toJSON();
    registrosHistorico = await transform.collection(registrosHistorico, 'ordemserv/GetHistoricoOrdemTransformer');

    response.send(registrosHistorico)
  }

  /**
   * Obtem a lista das Instrucoes Normativas alteradas da ordem solicitada.
   */
  async findInsNormAlteradas({ request, response, transform }) {
    const { id } = request.allParams();

    if (!id) {
      throw new exception("Identificador da ordem não informado!", 400);
    }

    let ordem = await ordemModel.query()
      .where('id', id)
      .with('estado')
      .with('instrucoesNormativas')
      .first();


    if (!ordem) {
      throw new exception("Ordem de serviço não encontrada!", 400);
    }

    ordem = ordem.toJSON();

    const instrucoesNormativas = await transform.collection(ordem.instrucoesNormativas, 'ordemserv/GetInstrucaoNormativaTransformer');
    delete ordem.instrucoesNormativas;
    ordem.instrucoesNormativas = instrucoesNormativas.filter(elem => elem.sofreuAlteracao === 1);

    const ordemTransformed = await transform.item(ordem, 'ordemserv/GetOrdemTransformer');
    ordemTransformed.dadosBasicos.dataVigenciaTemporaria = ordem.data_limite_vig_temp;
    response.send(ordemTransformed);
  }

  /**
   * Obtem a lista de estados possiveis para uma ordem.
   */
  async findEstados({ response }) {
    let retorno = await estadoModel.query().fetch();
    response.send(retorno)
  }

  /**
   * Obtem os dados completos de uma ordem de serviço.
   */
  async findOrdem({ request, response, transform }) {
    const { id, withResolucaoVinculos } = request.allParams();

    if (!id) {
      throw new exception("Id da Ordem de serviço não informado!", 400);
    }

    let ordem = await ordemModel.query()
      .where('id', id)
      .with('estado')
      .with('colaboradores', builder => {
        builder.with('dadosFunci', builder => {
          builder.with('nomeGuerra')
        })
      })
      .with('participantesEdicao', (builder) => {
        builder.with('tipoVinculo')
          .with('dadosFunciVinculado', (builderFunci) => {
            builderFunci.setVisible(['matricula', 'nome'])
          })
          .with('participanteExpandido', builder => {
            builder.with('dadosFunci')
              .orderBy('nome', 'asc')
          })
      })
      .with('instrucoesNormativas')
      .first();

    if (!ordem) {
      throw new exception("Ordem de serviço não encontrada!", 400);
    }

    ordem = ordem.toJSON();

    let participantes;

    if (withResolucaoVinculos) {
      participantes = await transform.collection(ordem.participantesEdicao, 'ordemserv/GetParticipanteEdicaoTransformer.withResolucaoVinculo')
    } else {
      participantes = await transform.collection(ordem.participantesEdicao, 'ordemserv/GetParticipanteEdicaoTransformer')
    }

    delete ordem.participantesEdicao;
    ordem.participantes = participantes;

    const colaboradores = await transform.collection(ordem.colaboradores, 'ordemserv/GetColaboradoresTransformer')
    delete ordem.colaboradores;
    ordem.colaboradores = colaboradores;

    const instrucoesNormativas = await transform.collection(ordem.instrucoesNormativas, 'ordemserv/GetInstrucaoNormativaTransformer');
    delete ordem.instrucoesNormativas;
    ordem.instrucoesNormativas = instrucoesNormativas;

    const ordemTransformed = await transform.item(ordem, 'ordemserv/GetOrdemTransformer')
    response.send(ordemTransformed);
  }

  /**
   * Obtem os dados de uma ordem de servico apenas com as
   * informacoes basicas para realizar a edicao da mesma.
   */
  async findOrdemEdicao({ request, response, session, transform }) {
    const { id } = request.allParams();

    let ordem = await ordemModel.query()
      .where('id', id)
      .first();

    if (!ordem) {
      throw new exception("Ordem de serviço não encontrada!", 400);
    }

    //verifica se o estado da ordem permite edicao
    if (![ESTADOS.RASCUNHO, ESTADOS.VIGENTE].includes(ordem.id_estado)) {
      throw new exception("Estado atual da ordem não permite edição!", 400);
    }

    let query = ordemModel.query()
      .where('id', id)
      .with('estado')
      .with('colaboradores', builder => {
        builder.with('dadosFunci', builder => {
          builder.with('nomeGuerra')
        })
      })
      .with('participantesEdicao', (builder) => {
        builder.with('tipoVinculo')
          .with('dadosFunciVinculado', (builderFunci) => {
            builderFunci.setVisible(['matricula', 'nome'])
          })
          .where('ativo', 1)
      })
      .with('instrucoesNormativas');

    if (ordem.id_estado === ESTADOS.VIGENTE) {
      query.with('autorizacaoConsulta', builder => {
        builder.with('dadosFunci', builder => {
          builder.with('nomeGuerra')
        })
      })
    }

    ordem = await query.first();
    ordem = ordem.toJSON();

    const participantes = await transform.collection(ordem.participantesEdicao, 'ordemserv/GetParticipanteEdicaoTransformer')
    delete ordem.participantesEdicao;
    ordem.participantes = participantes;

    const colaboradores = await transform.collection(ordem.colaboradores, 'ordemserv/GetColaboradoresTransformer')
    delete ordem.colaboradores;
    ordem.colaboradores = colaboradores;

    const autorizacaoConsulta = await transform.collection(ordem.autorizacaoConsulta, 'ordemserv/GetColaboradoresTransformer')
    delete ordem.autorizacaoConsulta;
    ordem.autorizacaoConsulta = autorizacaoConsulta;

    const instrucoesNormativas = await transform.collection(ordem.instrucoesNormativas, 'ordemserv/GetInstrucaoNormativaTransformer');
    delete ordem.instrucoesNormativas;
    ordem.instrucoesNormativas = instrucoesNormativas;

    const ordemTransformed = await transform.item(ordem, 'ordemserv/GetOrdemTransformer')

    let dadosUsuario = session.get('currentUserAccount');

    //verifica se o usuario eh designante.
    let dadosParticipante = await participanteExpandidoModel
      .query()
      .whereHas('participanteEdicao.ordem', (builder) => {
        builder.where('id', id)
          .where('tipo_participacao', TIPO_PARTICIPACAO.DESIGNANTE)
      })
      .where('matricula', dadosUsuario.chave)
      .first();

    let isDesignante = dadosParticipante ? true : false;
    ordemTransformed.isDesignante = isDesignante;

    response.send(ordemTransformed);
  }

  /**
   * Metodo que obtem os dados de acompanhamento (estatisticas) de um ordem de servico.
   */
  async findAcompanhamentoOrdem({ request, response }) {
    let { id } = request.allParams();

    let ordem = await ordemModel.query()
      .setVisible(['id', 'numero', 'titulo', 'tipo_validade', 'data_validade', 'id_estado'])
      .with('estado')
      .where('id', id)
      .first();

    if (!ordem) {
      throw new exception("Ordem de serviço não encontrada!", 400);
    }

    if (ordem.id_estado === ESTADOS.RASCUNHO) {
      throw new exception("Estado da ordem não permite acompanhamento!", 400);
    }

    ordem = ordem.toJSON();

    //objeto resultado que sera retornado
    let resultado = {
      dadosOrdem: {
        ...ordem,
        nomeEstado: ordem.estado.estado
      },
      designantes: [],
      designados: []
    }

    //calculando as estatisticas da ordem.
    let listaDesignantes = await participanteExpandidoModel
      .query()
      .with('participanteEdicao')
      .with('dadosFunci', builder => {
        builder.with('dependencia')
      })
      .whereHas('participanteEdicao.ordem', (builder) => {
        builder.where('id', id)
          .where('tipo_participacao', TIPO_PARTICIPACAO.DESIGNANTE)
      })
      .fetch();

    listaDesignantes = listaDesignantes.toJSON();

    for (const participante of listaDesignantes) {
      let statusAssinatura = "";

      if (participante.nao_passivel_assinatura) {
        statusAssinatura = "naoPassivelAssinatura"
      } else if (participante.assinou) {
        statusAssinatura = "assinou"
      } else if (!participante.assinou) {
        statusAssinatura = "naoAssinou"
      }

      let registro = {
        id: participante.id,
        prefixo: participante.prefixo,
        dependencia: participante.dadosFunci ? participante.dadosFunci.dependencia.nome : "NÃO LOCALIZADA",
        matricula: participante.matricula,
        nome: participante.nome,
        dataAssinatura: participante.data_assinatura !== null ? participante.data_assinatura : "",
        statusAssinatura
      }

      resultado.designantes.push(registro);
    }

    let listaDesignados = await participanteExpandidoModel
      .query()
      .with('participanteEdicao')
      .with('dadosFunci', builder => {
        builder.with('dependencia')
      })
      .whereHas('participanteEdicao.ordem', (builder) => {
        builder.where('id', id)
          .where('tipo_participacao', TIPO_PARTICIPACAO.DESIGNADO)
      })
      .fetch();

    listaDesignados = listaDesignados.toJSON();

    for (const participante of listaDesignados) {
      let statusAssinatura = "";

      if (participante.nao_passivel_assinatura) {
        statusAssinatura = "naoPassivelAssinatura"
      } else if (participante.assinou) {
        statusAssinatura = "assinou"
      } else if (!participante.assinou) {
        statusAssinatura = "naoAssinou"
      }

      let registro = {
        id: participante.id,
        prefixo: participante.prefixo,
        dependencia: participante.dadosFunci ? participante.dadosFunci.dependencia.nome : "NÃO LOCALIZADA",
        matricula: participante.matricula,
        nome: participante.nome,
        dataAssinatura: participante.data_assinatura !== null ? participante.data_assinatura : "",
        statusAssinatura
      }

      resultado.designados.push(registro);
    }

    response.send(resultado);
  }

  /**
   * Metodo utilitario que verifica se o usuario pode assinar a ordem solicitada.
   */
  async podeAssinar(idOrdem, matricula) {

    let permissao = { podeAssinar: true, motivo: "" };
    let ordem = await ordemModel.findBy('id', idOrdem);

    //verifica se o estado da ordem espera assinatura de designantes.
    //ordens vigentes do tipo comite podem conter assinatura de membros mesmo que
    //a ordem já esteja vigente.
    if (![ESTADOS.PENDENTE_ASSINATURA_DESIGNANTES, ESTADOS.VIGENTE].includes(ordem.id_estado)) {
      permissao.podeAssinar = false;
      permissao.motivo = "Estado da ordem não permite assinatura!";
      return permissao;
    }

    //verifica se o usuario esta na lista de participante expandido e ainda nao assinou.
    let dadosParticipante = await participanteExpandidoModel
      .query()
      .whereHas('participanteEdicao.ordem', (builder) => {
        builder.where('id', idOrdem).where('tipo_participacao', TIPO_PARTICIPACAO.DESIGNANTE)
      })
      .where('matricula', matricula)
      .first();

    if (!dadosParticipante) {
      permissao.podeAssinar = false;
      permissao.motivo = "Você não é participante desta ordem de serviço!";
      return permissao;
    }

    dadosParticipante = dadosParticipante.toJSON();

    if (dadosParticipante.assinou === 1) {
      permissao.podeAssinar = false;
      permissao.motivo = `Você já assinou esta ordem em ${dadosParticipante.data_assinatura}!`;
      return permissao;
    }

    return permissao;
  }

  /**
   * Metodo utilitario que verifica se o usuario pode dar ciencia na ordem solicitada.
   */
  async podeDarCiencia(idOrdem, matricula) {

    let permissao = { podeAssinar: true, motivo: "" };
    let ordem = await ordemModel.findBy('id', idOrdem);

    //verifica se o estado da ordem espera assinatura de designados.
    if (ordem.id_estado !== ESTADOS.VIGENTE) {
      permissao.podeAssinar = false;
      permissao.motivo = "Estado da ordem não permite dar ciência!";
      return permissao;
    }

    //verifica se o usuario esta na lista de participante expandido e ainda nao assinou.
    let registrosParticipante = await participanteExpandidoModel
      .query()
      .whereHas('participanteEdicao.ordem', (builder) => {
        builder.where('id', idOrdem).where('tipo_participacao', TIPO_PARTICIPACAO.DESIGNADO)
      })
      .where('matricula', matricula)
      .fetch();

    if (!registrosParticipante.rows.length) {
      permissao.podeAssinar = false;
      permissao.motivo = "Você não é participante desta ordem de serviço!";
      return permissao;
    }

    let jaAssinou = true;

    for (let participante of registrosParticipante.rows) {
      if (participante.assinou === 0) {
        jaAssinou = false;
        break;
      }
    }

    if (jaAssinou) {
      let dataAssinatura = null;

      for (let participante of registrosParticipante.rows) {
        if (participante.assinou) {
          dataAssinatura = moment(participante.data_assinatura).format("DD/MM/YY [às] hh:mm");
          break;
        }
      }

      permissao.podeAssinar = false;
      permissao.motivo = `Você já deu ciência nesta ordem em ${dataAssinatura}!`;
      return permissao;
    }

    return permissao;
  }

  /**
   * Metodo utilitario que verifica se o usuario pode revogar a ordem solicitada.
   */
  async podeRevogarOrdem(idOrdem, matricula, dadosUsuario = null) {

    let permissao = { podeAssinar: true, motivo: "" };
    let ordem = await ordemModel.findBy('id', idOrdem);

    //verifica se o estado da ordem permite revogacao.
    if (![ESTADOS.VIGENTE, ESTADOS.VIGENTE_PROVISORIA, ESTADOS.PENDENTE_ASSINATURA_DESIGNANTES].includes(ordem.id_estado)) {
      permissao.podeAssinar = false;
      permissao.motivo = "Estado da ordem não permite a revogação!";
      return permissao;
    }

    //verifica se o usuario esta na lista de participante expandido e ainda nao assinou.
    let dadosParticipante = await participanteExpandidoModel
      .query()
      .whereHas('participanteEdicao.ordem', (builder) => {
        builder.where('id', idOrdem).where('tipo_participacao', TIPO_PARTICIPACAO.DESIGNANTE)
      })
      .where('matricula', matricula)
      .first();

    if (!dadosParticipante) {
      //verifica a regra 02: estado = vigente_provisoria e funci possui nivel gerencial e é da mesma dependência da ordem
      if (ordem.id_estado === ESTADOS.VIGENTE_PROVISORIA && dadosUsuario) {
        let possuiNivelGerencial = await isComissaoNivelGerencial(dadosUsuario.cod_funcao)

        if (possuiNivelGerencial) {
          let ehParticipanteDependencia = await participanteEdicaoModel
            .query()
            .whereHas("ordem", builder => {
              builder.where("id", idOrdem)
            })
            .whereHas('participanteExpandido', builder => {
              //matricula nao estar na participante expandido
              builder.whereNot('matricula', dadosUsuario.chave)
            })

            //ordens do mesmo prefixo
            .where('prefixo', dadosUsuario.prefixo)
            //matricula nao estar na ordem edicao
            .whereNot('matricula', dadosUsuario.chave)
            .where('tipo_participacao', TIPO_PARTICIPACAO.DESIGNANTE)
            .first();


          if (ehParticipanteDependencia) {
            //cumpriu a regra de acesso
            return permissao
          }
        }
      }

      permissao.podeAssinar = false;
      permissao.motivo = "Você não tem permissão para revogar esta ordem! Precisa ser designante ou ter nível gerencial no prefixo e o estado da ordem ser vigente provisória para revogá-la.";
      return permissao;
    }

    return permissao;
  }

  /**
   * Metodo utilitario que verifica se o usuario pode confirmar as alteracoes nas instrucoes normativas.
   */
  async podeConfirmarAltInsNormativas(idOrdem, matricula) {
    let permissao = { podeAssinar: true, motivo: "" };
    let ordem = await ordemModel.findBy('id', idOrdem);

    //verifica se o estado da ordem permite revogacao.
    if (ESTADOS.VIGENTE_PROVISORIA !== ordem.id_estado) {
      permissao.podeAssinar = false;
      permissao.motivo = "Estado da ordem não permite a confirmação das alterações nas ins. normativas!";
      return permissao;
    }

    //verifica se o usuario esta na lista de participante expandido e ainda nao assinou.
    let dadosParticipante = await participanteExpandidoModel
      .query()
      .whereHas('participanteEdicao.ordem', (builder) => {
        builder.where('id', idOrdem).where('tipo_participacao', TIPO_PARTICIPACAO.DESIGNANTE)
      })
      .where('matricula', matricula)
      .first();

    if (!dadosParticipante) {
      //verifica se eh colaborador
      let dadosColaborador = await colaboradorModel
        .query()
        .where("id_ordem", idOrdem)
        .where("matricula", matricula)
        .first();

      if (dadosColaborador) {
        return permissao;
      } else {
        permissao.podeAssinar = false;
        permissao.motivo = "Você não tem permissão para realizar esta ação! Precisa ser designante ou colaborador da ordem.";
        return permissao;
      }
    }

    return permissao;
  }

  /**
  * Metodo utilitario que verifica se o usuario pode revogar ordem as alteracoes nas instrucoes normativas.
  */
  async podeRevogarPorAltInsNormativas(idOrdem, matricula) {
    let permissao = { podeAssinar: true, motivo: "" };
    let ordem = await ordemModel.findBy('id', idOrdem);

    //verifica se o estado da ordem permite revogacao.
    if (ESTADOS.VIGENTE_PROVISORIA !== ordem.id_estado) {
      permissao.podeAssinar = false;
      permissao.motivo = "Estado da ordem não permite a revogação por das alterações nas ins. normativas!";
      return permissao;
    }

    //verifica se o usuario esta na lista de participante expandido e ainda nao assinou.
    let dadosParticipante = await participanteExpandidoModel
      .query()
      .whereHas('participanteEdicao.ordem', (builder) => {
        builder.where('id', idOrdem).where('tipo_participacao', TIPO_PARTICIPACAO.DESIGNANTE)
      })
      .where('matricula', matricula)
      .first();

    if (!dadosParticipante) {
      //verifica se eh colaborador
      let dadosColaborador = await colaboradorModel
        .query()
        .where("id_ordem", idOrdem)
        .where("matricula", matricula)
        .first();

      if (dadosColaborador) {
        return permissao;
      } else {
        permissao.podeAssinar = false;
        permissao.motivo = "Você não tem permissão para realizar esta ação! Precisa ser designante ou colaborador da ordem.";
        return permissao;
      }
    }

    return permissao;
  }

  /**
   * Metodo publico do controler para consulta de permissao de assinatura pelo frontend.
   */
  async permiteAssinar({ request, response, session }) {
    //id da ordem
    let { id, darCiencia, revogar } = request.allParams();
    const dadosUsuario = session.get('currentUserAccount');

    if (!id) {
      throw new exception("Identificador da Ordem de serviço não informado!", 400);
    }

    try {
      let permissaoAssinar = {};

      if (darCiencia) {
        permissaoAssinar = await this.podeDarCiencia(id, dadosUsuario.chave);
      } else if (revogar) {
        permissaoAssinar = await this.podeRevogarOrdem(id, dadosUsuario.chave, dadosUsuario);
      } else {
        permissaoAssinar = await this.podeAssinar(id, dadosUsuario.chave);
      }

      response.send(permissaoAssinar);
    } catch (error) {
      throw new exception("Ocorreu um erro ao buscar a permissão do comando solicitado para esta ordem! Contate o administrador do sistema.", 400);
    }
  }

  /**
   * Metodo responsavel por realizar a assinatura de um ordem de servico.
   */
  async assinar({ request, response, session }) {
    //id da ordem
    let { id } = request.allParams();

    if (!id) {
      throw new exception("Identificador da Ordem de serviço não informado!", 400);
    }

    let idAtividadeApp = null;

    try {
      //inclui log da atividade na tabela de utilizacao
      idAtividadeApp = await registrarAtividadeAplicacao('Assinando Ordem de Serviço', id);

      const dadosUsuario = session.get('currentUserAccount');
      const permissaoAssinar = await this.podeAssinar(id, dadosUsuario.chave);

      if (!permissaoAssinar.podeAssinar) {
        throw new exception(permissaoAssinar.motivo, 400);
      }

      //obtem todos os registros pendente do participante na tabela de expansao
      //podem existir mais de 01 ... assina todos de uma vez.
      let listaDadosParticipante = await participanteExpandidoModel
        .query()
        .whereHas('participanteEdicao', (builder) => {
          builder.where('id_ordem', id)
            .where('tipo_participacao', TIPO_PARTICIPACAO.DESIGNANTE)
        })
        .where('matricula', dadosUsuario.chave)
        .fetch();

      for (const dadosParticipante of listaDadosParticipante.rows) {
        //gravando dados da assinatura
        if (dadosParticipante.assinou === 0) {
          dadosParticipante.data_assinatura = moment();
          dadosParticipante.assinou = 1;
          dadosParticipante.nao_passivel_assinatura = 0;
          await dadosParticipante.save();

          //grava o registro de assinatura do participante na ordem no historico
          await registrarHistorico({
            idOrdem: id,
            idEvento: EVENTOS_HISTORICO.ASSINOU_A_ORDEM,
            tipoParticipacao: TIPO_PARTICIPACAO.DESIGNANTE,
            request,
            session
          });

          //verifica se o vinculo de edicao do designante foi resolvido
          await this.verificaResolucaoVinculo(dadosParticipante.id_part_edicao)
        }
      }

      response.ok();

    } finally {
      //remove registro de utilizacao da tabela
      await removeRegistroAtividadeAplicacao(idAtividadeApp);
    }
  }

  /**
   * Verifica se o vinculo de edicao foi resolvido.
   * @param {Integer} idPartEdicao
   */
  async verificaResolucaoVinculo(idPartEdicao) {
    let dadosEdicao = await participanteEdicaoModel.findBy('id', idPartEdicao);

    if (dadosEdicao.resolvido) {
      //vinculo ja resolvido...
      //verificacao se deve por participante de comite
      //que quer assinar mesmo ja tendo atingido o quorum minimo.
      return;
    }

    switch (dadosEdicao.id_tipo_vinculo) {
      case TIPO_VINCULO.MATRICULA_INDIVIDUAL: {
        //apenas verifica se o funci individual assinou
        let dadosParticipante = await participanteExpandidoModel
          .query()
          .where('id_part_edicao', idPartEdicao)
          .first();

        if (dadosParticipante.assinou === 1) {
          //participante individual assinou, grava resolucao do vinculo
          dadosEdicao.resolvido = 1;
          await dadosEdicao.save();

          if (isDesignante(dadosEdicao.tipo_participacao)) {
            //verifica a resolucao de todos os designantes para mudar a ordem para vigente
            await this.verificaResolucaoTodosDesignantes(dadosEdicao.id_ordem);
          }
        }

        break;
      }

      case TIPO_VINCULO.COMITE: {
        //obtem todos os participantes do comite que assinaram
        let partAssinaram = await participanteExpandidoModel.query()
          .where('id_part_edicao', idPartEdicao)
          .where('assinou', 1)
          .fetch();

        partAssinaram = partAssinaram.toJSON();

        //obtem os todos os participantes do comite para analisar o tipo de votacao
        let partComite = await participanteExpandidoModel.query()
          .where('id_part_edicao', idPartEdicao)
          .fetch();

        partComite = partComite.toJSON();

        //quorum minimo
        let quorumMinimo = dadosEdicao.quorum_minimo;

        if (partAssinaram.length >= quorumMinimo) {
          //ja atingiu o quorum minimo, verifica se possui os votos obrigatorios
          //se houver titular, o titular tem que ter assinado
          //se nao houver titular, apenas substitutos estes devem ter assinado
          //se so houver os demais (normal) - apenas precisa cumprir o quorum minimo.
          let listaTiposVotacao = _.map(partComite, "cod_tipo_votacao");
          let cumpriuVotosObrigatorios = true;
          let partObrigatorios = [...partAssinaram];

          //verifica se possui o codigo de votacao de titular
          if (listaTiposVotacao.includes(TIPO_VOTACAO_COMITE.TITULAR)) {
            //possui codigo de titular, verifica assinaturas
            partObrigatorios = partComite.filter(elem => elem.cod_tipo_votacao === TIPO_VOTACAO_COMITE.TITULAR);
          } else if (listaTiposVotacao.includes(TIPO_VOTACAO_COMITE.SUBSTITUTO)) {
            //possui codigo de substituto, verifica assinaturas
            partObrigatorios = partComite.filter(elem => elem.cod_tipo_votacao === TIPO_VOTACAO_COMITE.SUBSTITUTO);
          }

          let diff = _.differenceBy(partObrigatorios, partAssinaram, 'matricula');
          cumpriuVotosObrigatorios = _.isEmpty(diff);

          if (cumpriuVotosObrigatorios) {
            //votos obrigatorios do comite alcancados, marca a resolucao do vinculo na edicao
            dadosEdicao.resolvido = 1;
            await dadosEdicao.save();

            if (isDesignante(dadosEdicao.tipo_participacao)) {
              //verifica a resolucao de todos os designantes para mudar a ordem para vigente
              await this.verificaResolucaoTodosDesignantes(dadosEdicao.id_ordem);
            }
          }
        }

        break;
      }

      default: {
        //obtem todos os participantes do vinculo que nao assinaram
        let partNaoAssinaram = await participanteExpandidoModel.query()
          .where('id_part_edicao', idPartEdicao)
          .where('assinou', 0)
          .fetch();

        if (!partNaoAssinaram.rows.length) {
          //se todos os participantes assinaram, marca o vinculo como resolvido
          dadosEdicao.resolvido = 1;
          await dadosEdicao.save();
        }
      }
    }
  }

  /**
   * Verifica se todos os vinculos de designantes foram resolvidos
   * e expande os designados caso afirmativo.
   * @param {*} idOrdem
   */
  async verificaResolucaoTodosDesignantes(idOrdem) {

    let dadosEdicao = await participanteEdicaoModel.query()
      .where('id_ordem', idOrdem)
      .where('tipo_participacao', TIPO_PARTICIPACAO.DESIGNANTE)
      .where('ativo', 1)
      .fetch();

    dadosEdicao = dadosEdicao.toJSON();

    let allSolved = true;

    for (const participante of dadosEdicao) {
      if (participante.resolvido === 0) {
        allSolved = false;
        break;
      }
    }

    if (allSolved) {
      //altera o status da ordem para VIGENTE
      let ordem = await ordemModel.findBy('id', idOrdem);
      ordem.id_estado = ESTADOS.VIGENTE;
      ordem.data_vig_ou_revog = moment();
      await ordem.save();

      //faz a chamada SEM o await de proposito para nao bloquear e ja retornar a
      //resposta. O processsamento continuará normalmente em background pelo NodeJs.
      this.processaResolucaoDesignantes(idOrdem);
    }

  }

  async processaResolucaoDesignantes(idOrdem) {
    //Todos os vinculos foram resolvidos. Expande os designados e os notifica.
    await expandirParticipantes(idOrdem, TIPO_PARTICIPACAO.DESIGNADO);
    //Notifica todos os designados para darem ciencia na ordem
    await notificarDesignados(idOrdem);
  }

  /**
   * Metodo responsavel por realizar a ciencia de um ordem de servico por um designado.
   */
  async darCiencia({ request, response, session }) {
    //id da ordem
    let { id } = request.allParams();

    if (!id) {
      throw new exception("Identificador da Ordem de serviço não informado!", 400);
    }

    let idAtividadeApp = null;

    try {
      //inclui log da atividade na tabela de utilizacao
      idAtividadeApp = await registrarAtividadeAplicacao('Dando ciência na Ordem de Serviço', id);

      const dadosUsuario = session.get('currentUserAccount');
      const permissaoAssinar = await this.podeDarCiencia(id, dadosUsuario.chave);

      if (!permissaoAssinar.podeAssinar) {
        throw new exception(permissaoAssinar.motivo, 400);
      }

      //obtem todos os registros pendentes do participante na tabela de expansao
      //pode exisitir mais de um... faz a ciencia em todos de uma vez só.
      let listaDadosParticipante = await participanteExpandidoModel
        .query()
        .whereHas('participanteEdicao', (builder) => {
          builder.where('id_ordem', id)
            .where('tipo_participacao', TIPO_PARTICIPACAO.DESIGNADO)
        })
        .where('matricula', dadosUsuario.chave)
        .fetch();

      for (const dadosParticipante of listaDadosParticipante.rows) {
        if (dadosParticipante.assinou === 0) {
          //gravando dados da assinatura
          dadosParticipante.data_assinatura = moment();
          dadosParticipante.assinou = 1;
          dadosParticipante.nao_passivel_assinatura = 0;
          await dadosParticipante.save();

          //grava o registro de assinatura do participante na ordem no historico
          await registrarHistorico({
            idOrdem: id,
            idEvento: EVENTOS_HISTORICO.CIENCIA_NA_ORDEM,
            tipoParticipacao: TIPO_PARTICIPACAO.DESIGNADO,
            request,
            session
          });

          //verifica se o vinculo de edicao do designado foi resolvido
          //so precisa verificar matricula individual e comite.
          await this.verificaResolucaoVinculo(dadosParticipante.id_part_edicao)
        }
      }

      response.ok();

    } finally {
      //remove registro de utilizacao da tabela
      await removeRegistroAtividadeAplicacao(idAtividadeApp);
    }
  }

  /**
   * Metodo que realiza a revogacao de uma ordem de servico.
   */
  async revogarOrdem({ request, response, session }) {
    let { id, porAlteracaoIN } = request.allParams();

    if (!id) {
      throw new exception("Identificador da Ordem de serviço não informado!", 400);
    }

    let idAtividadeApp = null;

    try {
      //inclui log da atividade na tabela de utilizacao
      idAtividadeApp = await registrarAtividadeAplicacao('Revogando Ordem de Serviço', id);

      const dadosUsuario = session.get('currentUserAccount');

      if (!porAlteracaoIN) {
        const permissaoAssinar = await this.podeRevogarOrdem(id, dadosUsuario.chave, dadosUsuario);

        if (!permissaoAssinar.podeAssinar) {
          throw new exception(permissaoAssinar.motivo, 400);
        }
      }

      //altera o status da ordem para REVOGADA
      let ordem = await ordemModel.findBy('id', id);
      ordem.id_estado = ESTADOS.REVOGADA;
      ordem.data_vig_ou_revog = moment();
      await ordem.save();

      //grava o registro de revogacao da ordem no historico
      await registrarHistorico({
        idOrdem: id,
        idEvento: EVENTOS_HISTORICO.REVOGOU_ORDEM,
        tipoParticipacao: TIPO_PARTICIPACAO.DESIGNANTE,
        request,
        session
      });

      //criando registro de revogacao para todos os participantes
      let listaParticipantes = await participanteExpandidoModel
        .query()
        .with('participanteEdicao')
        .with('dadosFunci')
        .whereHas('participanteEdicao.ordem', (builder) => {
          builder.where('id', id)
        })
        .fetch();

      listaParticipantes = listaParticipantes.toJSON();

      let motivoRevogacao = 'Ordem revogada pelo designante.';

      if (porAlteracaoIN) {
        motivoRevogacao = 'Ordem revogada por alteração nas Instruções Normativas';
      }

      for (const participante of listaParticipantes) {
        let dadosParticipante = {
          prefixo: participante.prefixo,
          chave: participante.matricula,
          nome_usuario: participante.nome,
          uor: participante.uor_participante,
          nome_funcao: participante.dadosFunci ? participante.dadosFunci.desc_cargo : "NÃO LOCALIZADO"
        };

        //grava o registro de remocao do participante por alteracao da ordem
        await registrarHistorico({
          idOrdem: id,
          idEvento: EVENTOS_HISTORICO.REMOVIDO_POR_REVOGACAO_ORDEM,
          tipoParticipacao: participante.participanteEdicao.tipo_participacao,
          request,
          dadosParticipante,
          respAlteracao: dadosUsuario.chave //usuario logado
        });

        //NOTIFICA VIA E-mail a saida da ordem de servico por revogacao da ordem
        let responsavelAlteracao = `${dadosUsuario.chave} - ${dadosUsuario.nome_usuario}`;

        await notificarRevogacao({
          idOrdem: id,
          idPartExpand: participante.id,
          tipoParticipante: participante.participanteEdicao.tipo_participacao,
          responsavelAlteracao,
          motivoRevogacao
        });

        //Obs: Nao deve remover o participante da tabela.
        //Este deve aparecer ainda na visualizacao da ordem.
        //A remocao so e realizada na edicao de um ordem vigente.
      }

      response.ok();

    } finally {
      //remove registro de utilizacao da tabela
      await removeRegistroAtividadeAplicacao(idAtividadeApp);
    }
  }

  async revogarPorAltInsNormativas({ request, response, session }) {
    let { id } = request.allParams();

    if (!id) {
      throw new exception("Identificador da Ordem de serviço não informado!", 400);
    }

    let idAtividadeApp = null;

    try {
      //inclui log da atividade na tabela de utilizacao
      idAtividadeApp = await registrarAtividadeAplicacao('Revogando Ordem por Alterações nas IN\'s', id);

      const dadosUsuario = session.get('currentUserAccount');
      const permissaoAssinar = await this.podeRevogarPorAltInsNormativas(id, dadosUsuario.chave);

      if (!permissaoAssinar.podeAssinar) {
        throw new exception(permissaoAssinar.motivo, 400);
      }

      //revoga a ordem
      request.params.porAlteracaoIN = true;
      await this.revogarOrdem({ request, response, session });
      response.ok();

    } finally {
      //remove registro de utilizacao da tabela
      await removeRegistroAtividadeAplicacao(idAtividadeApp);
    }
  }

  /**
   * Confirma as instrucoes normativas alteradas na ordem e solicita a
   * assinatura de todos os participantens novamente.
   */
  async confirmarInsNormAlteradas({ request, response, session }) {
    let { id } = request.allParams();

    if (!id) {
      throw new exception("Identificador da Ordem de serviço não informado!", 400);
    }

    let idAtividadeApp = null;

    try {
      //inclui log da atividade na tabela de utilizacao
      idAtividadeApp = await registrarAtividadeAplicacao('Confirmando Alterações nas IN\'s', id);

      const dadosUsuario = session.get('currentUserAccount');
      const permissaoAssinar = await this.podeConfirmarAltInsNormativas(id, dadosUsuario.chave);

      if (!permissaoAssinar.podeAssinar) {
        throw new exception(permissaoAssinar.motivo, 400);
      }

      let ordemAtual = await ordemModel.find(id);
      ordemAtual.id_estado = ESTADOS.REVOGADA;
      ordemAtual.data_vig_ou_revog = moment();
      ordemAtual.data_limite_vig_temp = null;
      await ordemAtual.save();

      let instrucoesNorm = await ordemAtual.instrucoesNormativas().fetch();
      instrucoesNorm = instrucoesNorm.toJSON();

      let possuiAlteracao = false;

      for (const ins of instrucoesNorm) {
        if (ins.sofreu_alteracao) {
          possuiAlteracao = true;

          let dadosAtualizar = {
            sofreu_alteracao: 0,
            versao: ins.nova_versao,
            nova_versao: 0,
            texto_item: ins.texto_item_alterado,
            texto_item_alterado: null
          }

          //atualiza os dados da instrucao
          await ordemAtual.instrucoesNormativas().where('id', ins.id).update({ ...dadosAtualizar });
        }
      }

      if (!possuiAlteracao) {
        throw new exception("Nenhuma instrução sofreu alteração nesta Ordem de serviço!", 400);
      }

      //grava o registro de revogacao da ordem no historico
      await registrarHistorico({
        idOrdem: id,
        idEvento: EVENTOS_HISTORICO.CONFIRMOU_ALTERACAO_DAS_INC,
        tipoParticipacao: TIPO_PARTICIPACAO.DESIGNANTE,
        request,
        session
      });

      //removendo a resolução de todos os vinculos de edicao da ordem
      await participanteEdicaoModel.query().where('id_ordem', id).update({ resolvido: 0 });

      //criando registro de revogacao para todos os participantes
      let listaParticipantes = await participanteExpandidoModel
        .query()
        .with('participanteEdicao')
        .with('dadosFunci')
        .whereHas('participanteEdicao.ordem', (builder) => {
          builder.where('id', id)
        })
        .fetch();

      listaParticipantes = listaParticipantes.toJSON();

      let motivoRevogacao = 'Houve alteração nas Instruções Normativas. Necessária nova assinatura.';

      for (const participante of listaParticipantes) {
        let dadosParticipante = {
          prefixo: participante.prefixo,
          chave: participante.matricula,
          nome_usuario: participante.nome,
          uor: participante.uor_participante,
          nome_funcao: participante.dadosFunci ? participante.dadosFunci.desc_cargo : "NÃO LOCALIZADO"
        };

        //grava o registro de remocao do participante por alteracao da ordem
        await registrarHistorico({
          idOrdem: id,
          idEvento: EVENTOS_HISTORICO.REMOVIDO_POR_ALTERACAO_NA_INC,
          tipoParticipacao: participante.participanteEdicao.tipo_participacao,
          request,
          dadosParticipante,
          respAlteracao: dadosUsuario.chave //usuario logado
        });

        //NOTIFICA VIA E-mail a saida da ordem de servico por revogacao da ordem
        let responsavelAlteracao = `${dadosUsuario.chave} - ${dadosUsuario.nome_usuario}`;

        await notificarRevogacao({
          idOrdem: id,
          idPartExpand: participante.id,
          tipoParticipante: participante.participanteEdicao.tipo_participacao,
          responsavelAlteracao,
          motivoRevogacao
        });

        if (participante.participanteEdicao.tipo_participacao === TIPO_PARTICIPACAO.DESIGNANTE) {
          //apenas limpa os dados de assinatura

          //verifica se o participante pode assinar
          let assinaturaNaoPossivel = 0;

          if (participante.dadosFunci) {
            assinaturaNaoPossivel = await naoPassivelAssinatura(participante.dadosFunci.cod_situacao, participante.dadosFunci.matricula);
          } else {
            assinaturaNaoPossivel = 1;
          }

          let dadosUpdate = {
            assinou: 0,
            data_assinatura: null,
            nao_passivel_assinatura: assinaturaNaoPossivel
          }

          //removendo as informacoes de assinatura do designante
          await participanteExpandidoModel.query().where('id', participante.id).update({ ...dadosUpdate });

        } else {
          //designado - remove da tabela - apos a assinatura dos designantes vai expandir novamente
          await participanteExpandidoModel.query().where('id', participante.id).delete();
        }
      }

      //Altera o estado da ordem para Pendente de Assinatura dos Designantes
      ordemAtual.id_estado = ESTADOS.PENDENTE_ASSINATURA_DESIGNANTES;
      ordemAtual.data_vig_ou_revog = null;
      await ordemAtual.save();

      //Notifica os designantes para Solicitar Assinatura
      await notificarDesignantes(id,
        'OrdemServ/SolicitarAssinaturaAlteracaoInsNorm',
        'Solicitação de Assinatura de Ordem de Serviço por Alteração nas Instruções Normativas'
      );

      response.ok();

    } finally {
      //remove registro de utilizacao da tabela
      await removeRegistroAtividadeAplicacao(idAtividadeApp);
    }
  }

  /**
   * Metodo responsável por Criar/Salvar os dados de uma ordem de serviço.
   */
  async store({ request, response, session, transform }) {
    let { dadosOrdem } = request.allParams();

    const schema = {
      dadosBasicos: 'required|object',
      instrucoesNorm: 'required|array',
      participantes: 'required|array',
      colaboradores: 'required|array',
    };

    let { dadosBasicos, instrucoesNorm, participantes, colaboradores } = dadosOrdem;

    const validation = await validate({
      dadosBasicos,
      instrucoesNorm,
      participantes,
      colaboradores
    }, schema);

    if (validation.fails()) {
      throw new exception("Campos obrigatórios não foram informados!", 400);
    }

    let dadosUsuario = session.get('currentUserAccount');

    if (dadosBasicos.id) {

      let ordemAtual = await ordemModel.findBy('id', dadosBasicos.id);

      if (!ordemAtual) {
        throw new exception("Ordem de serviço não encontrada!", 400);
      }

      if (ordemAtual.id_estado === ESTADOS.RASCUNHO) {
        await this.salvarOrdemRascunho({ dadosOrdem, transform });
      } else if (ordemAtual.id_estado === ESTADOS.VIGENTE) { //verificacao de garantia
        let idAtividadeApp = null;

        try {
          //inclui log da atividade na tabela de utilizacao
          idAtividadeApp = await registrarAtividadeAplicacao('Salvando Ordem Vigente', ordemAtual.id);
          await this.salvarOrdemVigente({ request, session, dadosOrdem, transform });
        } finally {
          //remove registro de utilizacao da tabela
          await removeRegistroAtividadeAplicacao(idAtividadeApp);
        }
      }

      //se nao lancou erro, retorna o id da ordem editada.
      return response.ok({ id: ordemAtual.id });

    } else {
      let novoId = await this.criarNovaOrdem({ request, session, dadosOrdem, dadosUsuario, transform });
      return response.ok({ id: novoId });
    }
  }

  async criarNovaOrdem({ request, session, dadosOrdem, dadosUsuario, transform }) {
    let { dadosBasicos, instrucoesNorm, participantes, colaboradores } = dadosOrdem;

    //criacao de uma nova ordem
    const trx = await Database.connection('mysqlOrdemServico').beginTransaction();

    try {

      let novaOrdem = new ordemModel();

      novaOrdem.titulo = dadosBasicos.titulo;
      novaOrdem.descricao = dadosBasicos.descricao;
      novaOrdem.id_estado = ESTADOS.RASCUNHO;
      novaOrdem.ano = (new Date()).getFullYear();
      novaOrdem.tipo_validade = dadosBasicos.tipoValidade;
      novaOrdem.confidencial = dadosBasicos.confidencial;

      if (dadosBasicos.tipoValidade === "Determinada") {
        novaOrdem.data_validade = dadosBasicos.dataValidade;
      }

      novaOrdem.matricula_autor = dadosUsuario.chave;
      novaOrdem.prefixo_autor = dadosUsuario.prefixo;

      await novaOrdem.save(trx);

      //salva a lista de colaboradores
      let listaColaboradores = colaboradores.map((elem) => { return { matricula: elem.matricula } });
      await novaOrdem.colaboradores().createMany(listaColaboradores, trx);

      //salva a lista de instrucoes normativas
      //================================================================
      //========== comentado para testes ===============================
      const listaInsNormFormatada = await transform.collection(instrucoesNorm, 'ordemserv/SetInstrucaoNormativaTransformer');

      for (const regINC of listaInsNormFormatada) {
        if (regINC.error) {
          throw new exception(`Instrução normativa não vigente encontrada! Verifique e tente novamente. ${regINC.message}`, 400);
        }
      }

      await novaOrdem.instrucoesNormativas().createMany(listaInsNormFormatada, trx);
      //================================================================

      //salvando a lista de participantes
      participantes = _.map(participantes, (e) => _.omit(e, 'id'));
      const listaParticFormatada = await transform.collection(participantes, 'ordemserv/SetParticipanteEdicaoTransformer')

      //salva toda a lista de participantes
      await novaOrdem.participantesEdicao().createMany(listaParticFormatada, trx);

      //fazendo commit das alteracoes
      await trx.commit();

      //registra o historico de criacao da ordem
      await registrarHistorico({
        idOrdem: novaOrdem.id,
        idEvento: EVENTOS_HISTORICO.CRIACAO_DA_ORDEM,
        tipoParticipacao: TIPO_PARTICIPACAO.COLABORADOR,
        request,
        session
      });

      return novaOrdem.id;

    } catch (error) {
      //on error faz o rollback
      await trx.rollback();

      if (error.message) {
        throw new exception(error.message, error.status);
      } else {
        throw new exception("Falha ao criar esta ordem de serviço! Contate o administrador do sistema.", 400);
      }
    }
  }

  async salvarOrdemRascunho({ dadosOrdem, transform }) {

    let { dadosBasicos, instrucoesNorm, participantes, colaboradores } = dadosOrdem;

    //atualizacao dos dados de uma ordem existente
    //realiza as alteracoes dentro de uma transaction
    const trx = await Database.connection('mysqlOrdemServico').beginTransaction();

    try {

      let ordemAtual = await ordemModel.findBy('id', dadosBasicos.id, trx);

      if (!ordemAtual) {
        throw new exception("Ordem de serviço não encontrada!", 400);
      }

      if (ordemAtual.id_estado !== ESTADOS.RASCUNHO) {
        throw new exception("Estado inválido para salvar esta Ordem de serviço!", 400);
      }

      ordemAtual.titulo = dadosBasicos.titulo;
      ordemAtual.descricao = dadosBasicos.descricao;
      ordemAtual.tipo_validade = dadosBasicos.tipoValidade;
      ordemAtual.confidencial = dadosBasicos.confidencial;

      if (dadosBasicos.tipoValidade === "Determinada") {
        ordemAtual.data_validade = dadosBasicos.dataValidade;
      } else {
        ordemAtual.data_validade = null;
      }

      //salva os dados basicos da ordem
      await ordemAtual.save(trx);

      //obtem a lista atual de colaboradores
      let listaAtualColab = await ordemAtual.colaboradores().fetch();
      listaAtualColab = listaAtualColab.toJSON();

      //obtem apenas a matricula da nova lista
      let novaListaColab = _.map(colaboradores, (e) => _.pick(e, 'matricula'));

      let novosColabs = _.differenceBy(novaListaColab, listaAtualColab, 'matricula');
      let colabsRemovidos = _.differenceBy(listaAtualColab, novaListaColab, 'matricula');
      colabsRemovidos = _.map(colabsRemovidos, 'matricula');

      if (!_.isEmpty(colabsRemovidos)) {
        //removendo os colaborares excluidos da lista
        await ordemAtual.colaboradores().whereIn('matricula', colabsRemovidos).delete(trx);
      }

      if (!_.isEmpty(novosColabs)) {
        //adiciona os novos colaboradores
        await ordemAtual.colaboradores().createMany(novosColabs, trx);
      }

      //remove todas as instrucoes anteriores
      await ordemAtual.instrucoesNormativas().delete(trx);

      //salva a lista de instrucoes normativas
      const listaInsNormFormatada = await transform.collection(instrucoesNorm, 'ordemserv/SetInstrucaoNormativaTransformer');

      for (const regINC of listaInsNormFormatada) {
        if (regINC.error) {
          throw new exception(`Instrução normativa não vigente encontrada! Verifique e tente novamente. ${regINC.message}`, 400);
        }
      }

      await ordemAtual.instrucoesNormativas().createMany(listaInsNormFormatada, trx);

      //obtem a lista atual de participantes
      let listaAtualPartic = await ordemAtual.participantesEdicao().setHidden(['ativo', 'resolvido']).fetch();
      listaAtualPartic = listaAtualPartic.toJSON();

      //obtem os novos participantes
      let novosParticipantes = _.differenceBy(participantes, listaAtualPartic, 'id');
      //obtem os participantes removidos
      let particRemovidos = _.differenceBy(listaAtualPartic, participantes, 'id');
      //os participantes que permaneceram devem ter seus dados apenas atualizados
      let particAtualizar = _.differenceBy(listaAtualPartic, particRemovidos, 'id');
      particRemovidos = _.map(particRemovidos, 'id');

      if (!_.isEmpty(particAtualizar)) {
        //atualizando os dados dos participantes que nao sairam da lista atual
        for (const partic of particAtualizar) {
          await ordemAtual.participantesEdicao().where('id', partic.id).transacting(trx).update({ ...partic });
        }
      }

      if (!_.isEmpty(particRemovidos)) {
        //se for rascunho pode excluir todos os tipos de participantes
        await ordemAtual.participantesEdicao().whereIn('id', particRemovidos).delete(trx);
      }

      if (!_.isEmpty(novosParticipantes)) {
        const listaNovosParticFormatada = await transform.collection(novosParticipantes, 'ordemserv/SetParticipanteEdicaoTransformer')

        //salva a lista dos novos participantes
        await ordemAtual.participantesEdicao().createMany(listaNovosParticFormatada, trx);
      }

      //fazendo commit das alteracoes
      await trx.commit();

      return ordemAtual.id;

    } catch (error) {
      //em caso de error faz o rollback
      await trx.rollback();

      if (error.message) {
        throw new exception(error.message, error.status);
      } else {
        throw new exception("Falha ao atualizar a ordem de serviço! Contate o administrador do sistema.", 400);
      }
    }

  }

  async salvarOrdemVigente({ request, session, dadosOrdem, transform }) {

    let { dadosBasicos, participantes, colaboradores, autorizacaoConsulta } = dadosOrdem;

    //atualizacao dos dados de uma ordem em vigencia ou vigencia temporaria
    //realiza as alteracoes dentro de uma transaction
    const trx = await Database.connection('mysqlOrdemServico').beginTransaction();

    try {

      let ordemAtual = await ordemModel.findBy('id', dadosBasicos.id, trx);

      if (!ordemAtual) {
        throw new exception("Ordem de serviço não encontrada!", 400);
      }

      if (![ESTADOS.VIGENTE].includes(ordemAtual.id_estado)) {
        throw new exception("Estado da Ordem nao permite alteração nos dados!", 400);
      }

      let dadosUsuario = session.get('currentUserAccount');

      //verifica se o usuario eh designante.
      let dadosParticipante = await participanteExpandidoModel
        .query()
        .whereHas('participanteEdicao.ordem', (builder) => {
          builder.where('id', dadosBasicos.id)
            .where('tipo_participacao', TIPO_PARTICIPACAO.DESIGNANTE)
        })
        .where('matricula', dadosUsuario.chave)
        .first();

      let ehDesignante = dadosParticipante ? true : false;

      if (ehDesignante) {
        //permite alterar apenas a confidencialidade da ordem neste caso
        ordemAtual.confidencial = dadosBasicos.confidencial;

        //salva os dados basicos da ordem
        await ordemAtual.save(trx);
      }

      //obtem a lista atual de colaboradores
      let listaAtualColab = await ordemAtual.colaboradores().fetch();
      listaAtualColab = listaAtualColab.toJSON();

      //obtem apenas a matricula da nova lista
      let novaListaColab = _.map(colaboradores, (e) => _.pick(e, 'matricula'));

      let novosColabs = _.differenceBy(novaListaColab, listaAtualColab, 'matricula');
      let colabsRemovidos = _.differenceBy(listaAtualColab, novaListaColab, 'matricula');
      colabsRemovidos = _.map(colabsRemovidos, 'matricula');

      if (!_.isEmpty(colabsRemovidos)) {
        //removendo os colaborares excluidos da lista
        await ordemAtual.colaboradores().whereIn('matricula', colabsRemovidos).delete(trx);
      }

      if (!_.isEmpty(novosColabs)) {
        //adiciona os novos colaboradores
        await ordemAtual.colaboradores().createMany(novosColabs, trx);
      }

      //==== VERIFICA SE FOI PASSADA A LISTA DE AUTORIZACOES DE CONSULTA ====
      if (autorizacaoConsulta) {
        //obtem a lista atual de autorizacoes
        let listaAtualConsulta = await ordemAtual.autorizacaoConsulta().fetch();
        listaAtualConsulta = listaAtualConsulta.toJSON();

        //obtem apenas a matricula da nova lista
        let novaListaConsulta = _.map(autorizacaoConsulta, (e) => _.pick(e, 'matricula'));

        let novosFuncis = _.differenceBy(novaListaConsulta, listaAtualConsulta, 'matricula');
        let funcisRemovidos = _.differenceBy(listaAtualConsulta, novaListaConsulta, 'matricula');
        funcisRemovidos = _.map(funcisRemovidos, 'matricula');

        if (!_.isEmpty(funcisRemovidos)) {
          //removendo os funcis excluidos da lista
          await ordemAtual.autorizacaoConsulta().whereIn('matricula', funcisRemovidos).delete(trx);
        }

        if (!_.isEmpty(novosFuncis)) {
          //adiciona os novos funcis
          await ordemAtual.autorizacaoConsulta().createMany(novosFuncis, trx);
        }
      }
      //=== FIM DA VALIDACAO DAS AUTORIZACOES DE CONSULTA =====

      //==== ALTERANDO A LISTA DE DESIGNADOS =====
      let novosParticipantes = []; //necessario estar fora pois sera utilizada apos salvar as alteracoes na ordem

      if (ehDesignante) {
        //obtem a lista atual de participantes
        let listaAtualPartic = await ordemAtual.participantesEdicao()
          .setHidden(['ativo', 'resolvido'])
          .where('tipo_participacao', TIPO_PARTICIPACAO.DESIGNADO)
          .where('ativo', 1)
          .fetch();

        listaAtualPartic = listaAtualPartic.toJSON();

        //obtem os participantes que sao designados
        participantes = participantes.filter(elem => isDesignado(elem.tipoParticipante));

        novosParticipantes = _.differenceBy(participantes, listaAtualPartic, 'id');
        let particRemovidos = _.differenceBy(listaAtualPartic, participantes, 'id');
        particRemovidos = _.map(particRemovidos, 'id');

        if (!_.isEmpty(novosParticipantes)) {
          const listaNovosParticFormatada = await transform.collection(novosParticipantes, 'ordemserv/SetParticipanteEdicaoTransformer')
          //salva a lista dos novos participantes
          await ordemAtual.participantesEdicao().createMany(listaNovosParticFormatada, trx);
        }

        if (!_.isEmpty(particRemovidos)) {
          //removendo os participantes expandidos excluidos da tabela e
          //inserindo registro de revogacao no historico
          let listaEdicaoDesignados = await ordemAtual.participantesEdicao()
            .where('tipo_participacao', TIPO_PARTICIPACAO.DESIGNADO)
            .whereIn('id', particRemovidos)
            .fetch();

          listaEdicaoDesignados = listaEdicaoDesignados.toJSON();

          for (const partEdicao of listaEdicaoDesignados) {
            //obtem a lista dos participantes expandidos para o id do part edicao
            let listaPartExpand = await participanteExpandidoModel.query(trx)
              .where('id_part_edicao', partEdicao.id)
              .fetch();

            listaPartExpand = listaPartExpand.toJSON();

            for (const partExpand of listaPartExpand) {
              let funci = await getOneFunci(partExpand.matricula);

              let dadosParticipante = {};
              dadosParticipante.prefixo = partExpand.prefixo;
              dadosParticipante.chave = partExpand.matricula;
              dadosParticipante.nome_usuario = partExpand.nome,
                dadosParticipante.uor = partExpand.uor_participante;
              dadosParticipante.nome_funcao = funci ? funci.descCargo : "INF. NAO LOCALIZADA";

              //registra o historico de remocao do participante
              //por alteracao da ordem
              await registrarHistorico({
                idOrdem: ordemAtual.id,
                idEvento: EVENTOS_HISTORICO.REMOVIDO_POR_ALTERACAO_ORDEM,
                tipoParticipacao: partEdicao.tipo_participacao,
                request,
                dadosParticipante,
                respAlteracao: dadosUsuario.chave //usuario logado
              });

              //NOTIFICA VIA E-mail a saida da ordem de servico por alteracao da ordem
              let responsavelAlteracao = `${dadosUsuario.chave} - ${dadosUsuario.nome_usuario}`;

              await notificarRevogacao({
                idOrdem: ordemAtual.id,
                idPartExpand: partExpand.id,
                tipoParticipante: partEdicao.tipo_participacao,
                responsavelAlteracao,
                motivoRevogacao: "Removido por alteração nos designados da ordem."
              });

              //remove o participante expandido da tabela
              await participanteExpandidoModel.query(trx).where('id', partExpand.id).delete();
            }
          }

          //excluir o(s) designado(s)
          await ordemAtual.participantesEdicao()
            .where('tipo_participacao', TIPO_PARTICIPACAO.DESIGNADO)
            .whereIn('id', particRemovidos)
            .delete(trx);
        }
      }

      //fazendo commit das alteracoes
      await trx.commit();

      //apos o sucesso no salvamento da transacao, expande os novos participantes e os notifica
      if (!_.isEmpty(novosParticipantes) && ehDesignante) {
        //guarda a lista dos participantes ja inseridos na tabela
        let listaPartAnteriores = await getListaParticipantes(ordemAtual.id, TIPO_PARTICIPACAO.DESIGNADO);

        //expande os novos participantes na tabela
        await expandirParticipantes(ordemAtual.id, TIPO_PARTICIPACAO.DESIGNADO, true);

        //obtem a lista de todos os participante apos a expansao
        let listaPartAposExp = await getListaParticipantes(ordemAtual.id, TIPO_PARTICIPACAO.DESIGNADO);

        //obtem a diferenca entre os participantes anteriores e os novos
        let partAdicionados = _.differenceBy(listaPartAposExp, listaPartAnteriores, 'matricula');

        for (const part of partAdicionados) {
          //notifica por email os novos participantes
          await notificarSolicitacaoCienciaParticipante({ idOrdem: ordemAtual.id, idPartExpand: part.id });
        }
      }

      return ordemAtual.id;

    } catch (error) {
      //em caso de erro faz o rollback
      await trx.rollback();

      if (error.message) {
        throw new exception(error.message, error.status);
      } else {
        throw new exception("Falha ao atualizar a ordem de serviço! Contate o administrador do sistema.", 400);
      }
    }
  }

  /**
   * Cria uma nova ordem de servico com base em uma ja existente.
   */
  async clonarOrdem({ request, response, session, transform }) {
    let { idBase } = request.allParams();

    const trx = await Database.connection('mysqlOrdemServico').beginTransaction();
    let dadosUsuario = session.get('currentUserAccount');

    try {
      let ordemBase = await ordemModel.find(idBase, trx);

      let novaOrdem = new ordemModel();

      novaOrdem.titulo = ordemBase.titulo;
      novaOrdem.descricao = ordemBase.descricao;
      novaOrdem.id_estado = ESTADOS.RASCUNHO;
      novaOrdem.ano = (new Date()).getFullYear();
      novaOrdem.tipo_validade = ordemBase.tipo_validade;
      novaOrdem.confidencial = ordemBase.confidencial;
      novaOrdem.id_base = idBase;

      if (ordemBase.tipoValidade === "Determinada") {
        novaOrdem.data_validade = ordemBase.data_validade;
      }

      novaOrdem.matricula_autor = dadosUsuario.chave;
      novaOrdem.prefixo_autor = dadosUsuario.prefixo;

      await novaOrdem.save(trx);

      //incluindo o usuario logado como unico colaborador
      await novaOrdem.colaboradores().create({ matricula: dadosUsuario.chave }, trx);

      //importando as instrucoes normativas
      let listaInsNormBase = await ordemBase.instrucoesNormativas()
        .setHidden(['id', 'id_ordem'])
        .fetch();

      listaInsNormBase = listaInsNormBase.toJSON();

      //salva a lista de instrucoes normativas
      let listaInsNormFormatada = await transform.collection(listaInsNormBase, 'ordemserv/GetInstrucaoNormativaTransformer');
      listaInsNormFormatada = await transform.collection(listaInsNormFormatada, 'ordemserv/SetInstrucaoNormativaTransformer');
      let listaInsNormFinal = [];

      for (const regINC of listaInsNormFormatada) {
        if (!regINC.error) {
          //adiciona apenas as instrucoes vigentes encontradas na base
          let tmp = { ...regINC };
          delete tmp.id;
          listaInsNormFinal.push(tmp);
        }
      }

      if (listaInsNormFinal.length) {
        await novaOrdem.instrucoesNormativas().createMany(listaInsNormFinal, trx);
        //removendo trecho abaixo - permitindo clonar mesmo que nao possua instrucoes vigentes.
        //se nenhuma instrucao estiver vigente, retorna erro ao clonar a ordem
        // throw new exception('Nenhuma instrução da ordem base está vigente! Verifique e tente novamente.', 400);
      }

      //importando os participantes edicao
      let listaParticipantes = await ordemBase.participantesEdicao()
        .where('ativo', 1)
        .setHidden(['id', 'id_ordem', 'resolvido'])
        .fetch();

      listaParticipantes = listaParticipantes.toJSON();

      for (const partic of listaParticipantes) {
        if (partic.id_tipo_vinculo === TIPO_VINCULO.MATRICULA_INDIVIDUAL) {
          try {
            const funci = await getOneFunci(partic.matricula);
            if (!funci) {
              //funci nao encontrado... ignora na nova ordem
              continue;
            }
          } catch (err) {
            continue;
          }
        } else if (partic.id_tipo_vinculo === TIPO_VINCULO.COMITE) {
          try {
            //verifica se o comite ainda existe
            let dadosComite = await getDadosComite(partic.prefixo, partic.codigo_comite);
            if (!dadosComite) {
              continue;
            }
          } catch (err) {
            continue;
          }
        }

        //verificando se o participante ainda é valido na base
        await novaOrdem.participantesEdicao().create({ ...partic, 'resolvido': 0 }, trx);
      }


      //commitando as alteracoes da nova ordem
      await trx.commit();

      //incluir o historico de criacao da nova ordem
      await registrarHistorico({
        idOrdem: novaOrdem.id,
        idEvento: EVENTOS_HISTORICO.DUPLICOU_ORDEM,
        tipoParticipacao: TIPO_PARTICIPACAO.COLABORADOR,
        request,
        session
      });

      response.send({ id: novaOrdem.id });

    } catch (error) {
      await trx.rollback();

      if (error.message) {
        throw new exception(error.message, error.status);
      } else {
        throw new exception("Falha ao clonar esta ordem de serviço! Contate o administrador do sistema.", 400);
      }
    }
  }

  async removerAutorizacaoConsulta({ request, response, session }) {
    const { idOrdem } = request.allParams()
    let dadosUsuario = session.get('currentUserAccount')

    try {
      await autorizacaoConsultaModel.query()
        .where('id_ordem', idOrdem)
        .where('matricula', dadosUsuario.chave)
        .delete()

      response.ok()
    } catch (error) {
      throw new exception(error.message, error.status);
    }
  }

  /**
   * Obtem os dados de um funcionario especifico aplicando a regra
   * de apenas nivel gerencial quando o tipo de participante for Designante.
   */
  async findParticipanteByTipo({ request, response }) {
    const { matricula, tipoParticipante } = request.allParams();

    if (!matricula || matricula.length < 8 || !matricula.startsWith("F")) {
      throw new exception("Matrícula do funci não informada!", 400);
    }

    var patt = /^F\d{7}/i;

    if (matricula.length < 8 || !patt.exec(matricula)) {
      throw new exception("Formato incorreto da matrícula do funci!", 400);
    }

    const funci = await getOneFunci(matricula);

    if (!funci) {
      throw new exception("Funcionário não encontrado!", 400);
    }

    //verifica se o funci tem nivel gerencial, caso o tipo de participante seja designante
    if (isDesignante(tipoParticipante)) {
      let codFuncao = parseInt(funci.comissao);
      let possuiNivelGerencial = await isComissaoNivelGerencial(codFuncao);

      if (!possuiNivelGerencial) {
        //funci nao possui nivel gerencial
        throw new exception("Permitido apenas Designantes de nível gerencial!", 400);
      }
    }

    response.ok(funci);
  }

  /**
   * Metodo que faz um soft delete de uma ordem na base de dados.
   * Apenas ordens no estado Rascunho podem ser removidas por um colaborador da ordem.
   *
   */
  async deleteOrdem({ request, response, session }) {
    let { id } = request.allParams();

    if (!id) {
      throw new exception("Id da ordem não informado!", 400);
    }

    //obtem os dados da ordem
    let ordemAtual = await ordemModel.findBy('id', id);

    if (!ordemAtual) {
      throw new exception("Ordem de serviço não encontrada!", 400);
    }

    if (ordemAtual.id_estado !== ESTADOS.RASCUNHO) {
      throw new exception("Estado atual da ordem não permite remoção!", 400);
    }

    //como trata-se de um rascunho, apenas altera o estado para excluída
    ordemAtual.id_estado = ESTADOS.EXCLUIDA;
    await ordemAtual.save();

    //registra o historico de exclusao da ordem
    await registrarHistorico({
      idOrdem: id,
      idEvento: EVENTOS_HISTORICO.EXCLUIU_ORDEM,
      tipoParticipacao: TIPO_PARTICIPACAO.COLABORADOR,
      request,
      session
    });

    response.ok();
  }

  /**
   * Metodo que efetua o comando de finalizar rascunho da ordem.
   * Este metodo realiza as seguintes ações:
   *
   * 1 - Cria um novo número para a ordem;
   * 2 - Altera o estado da ordem para "Aguardando assinatura designantes";
   * 3 - Expande os vinculos dos demandantes para a tabela participante expandido;
   * 4 - Inclui registro no Historico de "Finalizou Rascunho";
   * 5 - Envia os e-mails de solicitacao de assinatura.
   */
  async finalizarRascunho({ request, response, session }) {
    let { id } = request.allParams();

    if (!id) {
      throw new exception("Id da ordem não informado!", 400);
    }

    //obtem os dados da ordem
    let ordemAtual = await ordemModel.findBy('id', id);

    if (!ordemAtual) {
      throw new exception("Ordem de serviço não encontrada!", 400);
    }

    if (ordemAtual.id_estado !== ESTADOS.RASCUNHO) {
      throw new exception("Estado atual da ordem não permite a finalização do rascunho!", 400);
    }

    let dadosNroOrdem = await this.getNovoNumeroOrdem();

    ordemAtual.sequencial = dadosNroOrdem.sequencial;
    ordemAtual.ano = dadosNroOrdem.ano;
    ordemAtual.numero = dadosNroOrdem.numero;
    ordemAtual.id_estado = ESTADOS.PENDENTE_ASSINATURA_DESIGNANTES;

    try {
      await ordemAtual.save();
    } catch (error) {
      //se der duplicate entry - obteM novo numero e salvar novamente
      dadosNroOrdem = await this.getNovoNumeroOrdem();
      ordemAtual.sequencial = dadosNroOrdem.sequencial;
      ordemAtual.ano = dadosNroOrdem.ano;
      ordemAtual.numero = dadosNroOrdem.numero;
      ordemAtual.id_estado = ESTADOS.PENDENTE_ASSINATURA_DESIGNANTES;
      await ordemAtual.save();
    }


    let idAtividadeApp = null;

    try {
      //inclui log da atividade na tabela de utilizacao
      idAtividadeApp = await registrarAtividadeAplicacao('Finalizando Rascunho da Ordem', ordemAtual.id);

      //expandindo os designantes
      await expandirParticipantes(id);

      await registrarHistorico({
        idOrdem: id,
        idEvento: EVENTOS_HISTORICO.FINALIZOU_RASCUNHO,
        tipoParticipacao: TIPO_PARTICIPACAO.COLABORADOR,
        request,
        session
      });

      //envia os emails de solicitacao de assinatura aos designantes
      await notificarDesignantes(id);

    } catch (err) {
      //desfaz o numero gerado
      ordemAtual.sequencial = null;
      ordemAtual.numero = null;
      ordemAtual.id_estado = ESTADOS.RASCUNHO;
      await ordemAtual.save();

      //remove os participantes expandidos
      let listaParticEdicao = await ordemAtual
        .participantesEdicao()
        .fetch()

      for (const partEdicao of listaParticEdicao.rows) {
        await participanteExpandidoModel.query().where('id_part_edicao', partEdicao.id).delete();
      }

      throw new exception("Falha ao finalizar o rascunho desta ordem! Contate o adminstrador do sistema.", 400)
    } finally {
      //remove registro de utilizacao da tabela
      await removeRegistroAtividadeAplicacao(idAtividadeApp);
    }

  }

  /**
   * Metodo utilitario para gerar um novo número de ordem de serviço.
   */
  async getNovoNumeroOrdem() {
    const ano = (new Date()).getFullYear();

    let maxSeq = await ordemModel.query()
      .max('sequencial as sequencial')
      .where('ano', ano)
      .first();

    if (!maxSeq) {
      throw new exception("Falha ao obter um novo número para esta ordem!")
    }

    let novoSequencial = maxSeq.sequencial + 1;

    return {
      sequencial: novoSequencial,
      ano,
      numero: ano + "/" + String(novoSequencial).padStart(5, '0')
    }

  }

  /**
   *
   * @param {*} params - parametros da requisicao:
   *
   * (Integer) nroINC (obrigatorio) - Número da IN
   * (Integer) tipoNormativo (obrigatorio) - tipo de normativo:
   *            0 - Informacao Auxiliar
   *            1 - Disposição Normativa
   *            2 - Procedimentos
   *
   * (String) baseItem (opcional) - item pai base no qual serao retornados os filhos.
   * Se for omitido busca o primeiro nível dos titulos da IN informada para o tipo de
   * normativo solicitado.
   *
   */
  async findNodes({ request, response, session }) {
    let { nroINC, codTipoNormativo, baseItem } = request.allParams();
    let dadosUsuario = session.get('currentUserAccount');

    nroINC = parseInt(nroINC)

    try {
      //obtem a lista de in's restritas para ordem de servico
      const listaInsRestritas = await incRestritaModel.ids();

      if (listaInsRestritas.includes(nroINC)) {
        throw new exception("Instrução Normativa não passível de Ordem de Serviço. Vide IN-291 item 6.", 400);
      }

      let ocorrencias = await baseIncUtils.findNodes({ nroINC, codTipoNormativo, baseItem, userRoles: dadosUsuario.roles });
      response.send(ocorrencias);
    } catch (err) {
      if (err.message) {
        throw new exception(err.message, 400);
      } else {
        throw new exception(`Falha ao obter as ocorrências da consulta desta IN: ${nroINC}!`, 400);
      }
    }
  }

  async voltarParaRascunho({ request, response, session }) {
    let { id: idOrdem } = request.allParams();

    if (!idOrdem) {
      throw new exception("Id da ordem não informado!")
    }

    let ordemAtual = await ordemModel.find(idOrdem);

    if (ordemAtual.id_estado !== ESTADOS.PENDENTE_ASSINATURA_DESIGNANTES) {
      throw new exception("Estado da Ordem não permite voltar para rascunho!", 400);
    }

    let idAtividadeApp = null;

    try {
      //inclui log da atividade na tabela de utilizacao
      idAtividadeApp = await registrarAtividadeAplicacao('Voltando ordem para rascunho.', idOrdem);

      ordemAtual.id_estado = ESTADOS.RASCUNHO;
      ordemAtual.data_vig_ou_revog = null;
      ordemAtual.numero = null;
      await ordemAtual.save();

      //remove todos os participantes expandidos
      let listaParticEdicao = await ordemAtual
        .participantesEdicao()
        .fetch()

      for (const partEdicao of listaParticEdicao.rows) {
        await participanteExpandidoModel.query().where('id_part_edicao', partEdicao.id).delete();
        partEdicao.resolvido = 0;
        await partEdicao.save();
      }

      let tipoParticipacao = TIPO_PARTICIPACAO.COLABORADOR;
      const dadosUsuario = session.get('currentUserAccount');

      //verifica se o usuario eh designante.
      let dadosParticipante = await participanteExpandidoModel
        .query()
        .setVisible(["matricula"])
        .whereHas("participanteEdicao.ordem", builder => {
          builder.where("id", idOrdem);
        })
        .where("matricula", dadosUsuario.chave)
        .first();

      if (dadosParticipante) {
        tipoParticipacao = TIPO_PARTICIPACAO.DESIGNANTE
      }

      //grava historico de voltar pra rascunho
      await registrarHistorico({
        idOrdem,
        idEvento: EVENTOS_HISTORICO.VOLTOU_PARA_RASCUNHO,
        tipoParticipacao,
        request,
        session
      });

      //remove os participantes expandidos da ordem
      await participanteExpandidoModel.query()
        .whereHas('participanteEdicao.ordem', (builder) => {
          builder.where("id_ordem", idOrdem)
        })
        .delete();

      return response.ok();
    } finally {
      //remove registro de utilizacao da tabela
      await removeRegistroAtividadeAplicacao(idAtividadeApp);
    }
  }

  async ordensAnalisadas({ request, response }) {
    const { gestor, instrucao, redeVarejo } = request.allParams();
    const db = Database.connection('dipes');

    let filters = "";

    if (gestor) {
      filters += ` AND ins.CD_DEPE_RSP_ASNT = '${gestor}'`
    }

    if (instrucao) {
      filters += ` AND ita.in = '${instrucao}'`
    }

    if (redeVarejo && redeVarejo !== "ambos" && ["Sim", "Não"].includes(redeVarejo)) {
      filters += ` AND ita.rede_varejo = '${redeVarejo}'`
    }

    const listaOrdensAnalisadas = await db.raw(`
      SELECT ins.CD_DEPE_RSP_ASNT AS gestor,
        mst.nome AS nome_gestor,
        ita.in,
        ins.TX_TIT_ASNT AS titulo,
        ita.tipo,
        ins.TX_TIP_CTU_ASNT AS descricao,
        ita.rede_varejo,
        ita.item,
        CASE WHEN ISNULL(ins.TX_PRGF_CTU) THEN 'INDISPONÍVEL' ELSE ins.TX_PRGF_CTU END AS texto,
        ins.NR_VRS_CTU_ASNT as versao
      FROM app_ordem_servico.tb_itens_analisados ita
      LEFT JOIN Base_IN.tb_in_vigente ins ON ins.CD_ASNT = ita.in AND ins.CD_TIP_CTU_ASNT = ita.tipo AND ins.CD_NVL_PRGF_CTU = ita.item
      LEFT JOIN DIPES.mst606_sb00 mst ON CAST(mst.prefixo AS INT) = ins.CD_DEPE_RSP_ASNT
      WHERE ita.pertinente <> 'Não' AND NOT ISNULL(ins.TX_TIT_ASNT) ${filters}
    `);

    return response.send(listaOrdensAnalisadas[0])
  }

  async getListaGestores({ response }) {
    const db = Database.connection('dipes');

    const listaGestores = await db.raw(`
      SELECT distinct ins.CD_DEPE_RSP_ASNT as gestor, mst.nome as nome_gestor
      FROM app_ordem_servico.tb_itens_analisados ita
      LEFT JOIN Base_IN.tb_in_vigente ins ON ins.CD_ASNT = ita.in AND ins.CD_TIP_CTU_ASNT = ita.tipo AND ins.CD_NVL_PRGF_CTU = ita.item
      LEFT JOIN DIPES.mst606_sb00 mst ON CAST(mst.prefixo AS INT) = ins.CD_DEPE_RSP_ASNT
      WHERE ita.pertinente <> 'Não' AND NOT ISNULL(ins.TX_TIT_ASNT)
    `);

    return response.send(listaGestores[0])
  }

  async getListaInstrucoes({ response }) {
    const db = Database.connection('dipes');

    const listaInstrucoes = await db.raw(`
      SELECT distinct ita.in, ins.TX_TIT_ASNT AS titulo
      FROM app_ordem_servico.tb_itens_analisados ita
      LEFT JOIN Base_IN.tb_in_vigente ins ON ins.CD_ASNT = ita.in AND ins.CD_TIP_CTU_ASNT = ita.tipo AND ins.CD_NVL_PRGF_CTU = ita.item
      LEFT JOIN DIPES.mst606_sb00 mst ON CAST(mst.prefixo AS INT) = ins.CD_DEPE_RSP_ASNT
      WHERE ita.pertinente <> 'Não' AND NOT ISNULL(ins.TX_TIT_ASNT)
    `);

    return response.send(listaInstrucoes[0])
  }

  async findOrdemEstoque({ request, response, transform }) {
    const { id, idHistorico } = request.allParams();

    if (!id) {
      throw new exception(`Id da ordem não informado`, 400);
    }

    if (!idHistorico) {
      throw new exception("Identificado do histórico não informado!", 400)
    }

    //busca a ordem no registro de historicos
    let ordemEstoque = await ordemHistoricoModel.query()
      .where("id", idHistorico)
      .where("id_ordem", id)
      .setVisible(["dados_ordem"])
      .first();

    if (!ordemEstoque) {
      throw new exception("Dados da ordem estoque não encontrada!", 400)
    }

    let ordem = JSON.parse(ordemEstoque.dados_ordem);

    if (!ordem) {
      throw new exception("Falha ao obter os dados da ordem estoque pesquisada.", 400)
    }

    for (let partEdit of ordem.participantesEdicao) {
      if (!partEdit.tipoVinculo) {
        let vinculo = await tipoVinculoModel.find(partEdit.id_tipo_vinculo);
        partEdit.tipoVinculo = { tipo_vinculo: vinculo.tipo_vinculo }
      }

      if (partEdit.id_tipo_vinculo === TIPO_VINCULO.MATRICULA_INDIVIDUAL) {
        let dadosFunci = await getOneFunci(partEdit.matricula);

        if (dadosFunci) {
          partEdit.dadosFunciVinculado = { nome: dadosFunci.nome }
        }
      }
    }

    const participantes = await transform.collection(ordem.participantesEdicao, 'ordemserv/GetParticipanteEdicaoTransformer.withResolucaoVinculo')

    delete ordem.participantesEdicao;
    ordem.participantes = participantes;

    // const colaboradores = await transform.collection(ordem.colaboradores, 'ordemserv/GetColaboradoresTransformer')
    delete ordem.colaboradores;
    // ordem.colaboradores = colaboradores;

    const instrucoesNormativas = await transform.collection(ordem.instrucoesNormativas, 'ordemserv/GetInstrucaoNormativaTransformer');
    delete ordem.instrucoesNormativas;
    ordem.instrucoesNormativas = instrucoesNormativas;

    const ordemTransformed = await transform.item(ordem, 'ordemserv/GetOrdemTransformer')
    response.send(ordemTransformed);
  }

  async findLinkPublico({ request, response }) {
    const { id } = request.allParams();

    if (!id) {
      throw new exception("Id da ordem não informado!", 400)
    }

    const ordem = await ordemModel.query().where('id', id).setVisible(['hash_link_publico', 'senha_link_publico']).first();

    if (!ordem) {
      throw new exception("Ordem de serviço não encontrada!", 400)
    }

    if (!ordem.hash_link_publico) {
      response.ok({ hash: '', senha: '' })
      return
    }

    response.ok({ hash: ordem.hash_link_publico, senha: ordem.senha_link_publico })
  }

  async novoLinkPublico({ request, response }) {
    const { id } = request.allParams();

    if (!id) {
      throw new exception("Id da ordem não informado!", 400)
    }

    const ordem = await ordemModel.query().where('id', id).setVisible(['hash_link_publico', 'senha_link_publico']).first();

    if (!ordem) {
      throw new exception("Ordem de serviço não encontrada!", 400)
    }

    if (ordem.hash_link_publico) {
      //se ja tem o link publico cadastrado retorna o mesmo
      response.ok({ hash: ordem.hash_link_publico, senha: ordem.senha_link_publico })
      return
    }

    //nao possui o link publico cadastrado, cria um novo
    const hash = md5((new Date()).getTime())
    const password = String(md5(String(id) + "-" + (new Date()).getTime())).toUpperCase().substr(0, 8)

    try {
      //salva o hash e a senha para esta ordem
      ordem.hash_link_publico = hash;
      ordem.senha_link_publico = password;
      await ordem.save();
      response.ok({ hash, senha: password })
    } catch (err) {
      throw new exception("Falha ao criar o link público desta ordem!", 500)
    }
  }

  async novaSenhaLinkPublico({ request, response }) {
    const { id } = request.allParams();

    if (!id) {
      throw new exception("Id da ordem não informado!", 400)
    }

    const ordem = await ordemModel.query().where('id', id).setVisible(['hash_link_publico', 'senha_link_publico']).first();

    if (!ordem) {
      throw new exception("Ordem de serviço não encontrada!", 400)
    }

    if (!ordem.hash_link_publico) {
      throw new exception("Ordem informada não possui link público cadastrado!", 400)
    }

    const password = String(md5(String(id) + "-" + (new Date()).getTime())).toUpperCase().substr(0, 8)

    try {
      //salva a nova senha para esta ordem
      ordem.senha_link_publico = password;
      await ordem.save();
      response.ok({ hash: ordem.hash_link_publico, senha: password })
    } catch (err) {
      throw new exception("Falha ao criar o link público desta ordem!", 500)
    }
  }

  async deleteLinkPublico({ request, response }) {
    const { id } = request.allParams();

    if (!id) {
      throw new exception("Id da ordem não informado!", 400)
    }

    const ordem = await ordemModel.query().where('id', id).setVisible(['hash_link_publico', 'senha_link_publico']).first();

    if (!ordem) {
      throw new exception("Ordem de serviço não encontrada!", 400)
    }

    if (!ordem.hash_link_publico) {
      throw new exception("Ordem informada não possui link público cadastrado!", 400)
    }

    try {
      //salva o hash e senha como null nesta ordem
      ordem.hash_link_publico = null;
      ordem.senha_link_publico = null;
      await ordem.save();
      response.ok()
    } catch (err) {
      throw new exception("Falha ao criar o link público desta ordem!", 500)
    }
  }

  async testeCommandRotinaVerificacaoNoturna({ response }) {
    // Método criado para teste da RotinaVerificacaoNoturna.
    // Manter código comentado enquanto não estiver testando.

    // const rotina = new RotinaVerificacaoNoturna();
    // rotina.handle()
    //   .catch((err) => {
    //     throw new exception(err);
    //   });
    // response.ok();
  }

}

module.exports = OrdemServicoController
