"use strict";

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/View')} View */
/** @typedef {import('@adonisjs/auth/src/Schemes/Session')} AuthSession */
/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */

const demandasModel = use("App/Models/Mongo/Demandas/Demandas");
const historicoModel = use("App/Models/Mongo/Demandas/Historico");
const historicoNotificacoesModel = use(
  "App/Models/Mongo/Demandas/HistoricoNotificacoes"
);
const notificacoesModel = use("App/Models/Mongo/Demandas/Notificacoes");
const respostasModel = use("App/Models/Mongo/Demandas/Respostas");
const respostasRascunhoModel = use(
  "App/Models/Mongo/Demandas/RespostasRascunho"
);
const respostasExcluidasModel = use(
  "App/Models/Mongo/Demandas/RespostasExcluidas"
);
/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const funciModel = use("App/Models/Mysql/Funci");
const { MongoTypes } = use("App/Models/Mongo/FactoryModelMongo");

// === Helpers === //
const { sendMail } = use("App/Commons/SendMail");
const isPublicoAlvo = use("App/Commons/Demandas/isPublicoAlvo");
const isUserColaborador = use("App/Commons/Demandas/isUserColaborador");
const { getManyFuncis, getManyDependencias, pretifyFunci } = use(
  "App/Commons/Arh"
);
const jsonExport = use("App/Commons/JsonExport");

// === Dependencias === //
const Env = use("Env");
const exception = use("App/Exceptions/Handler");
const { validate } = use("Validator");
const moment = use("App/Commons/MomentZone");
const _ = require("lodash");
const Logger = use("Logger");

// ===== Constantes a serem utilizadas na Controller ===== //

const STATUS_DEMANDA = {
  EM_EDICAO: 1,
  PUBLICADA: 2,
  ENCERRADA: 3,
};

const TIPOS_NOTIFICACAO = {
  CONVITE: "convite",
  LEMBRETE: "lembrete",
  AGRADECIMENTO: "agradecimento",
  EXCLUSAO_RESPOSTA: "exclusao resposta",
  EXCLUSAO_TODAS_RESPOSTAS: "exclusao todas respostas",
};

const TIPOS_PUBLICOS = {
  DEFAULT: "publicos",
  PUBLICOS: "publicos",
  LISTA: "lista",
};

const FRONTEND_URL = Env.get("FRONTEND_URL", "http://localhost:3000/v8/");

const MAX_ENVIO_LEMBRETES = 10;
const DEFAULT_REMETENTE_EMAILS = "demandas.naoresponder@bb.com.br";
const { ObjectId } = MongoTypes;

class DemandaController {
  /**
   * Metodo utilitario para obter os dados de uma demanda com o historico
   * a partir do id.
   * @param {*} id
   */
  async getDemandaById(id) {
    const demanda = await demandasModel.findById(id).populate({
      path: "historico",
      model: historicoModel,
      options: {
        sort: { dataRegistro: -1 },
        limit: 100,
        select: {
          id: 1,
          dataRegistro: 1,
          acao: 1,
          dadosResponsavel: 1,
          idDemanda: 1,
        },
      },
    });

    return demanda;
  }

  async _getDadosBasicosDemanda(idDemanda) {
    const demanda = await demandasModel
      .findById(idDemanda, {
        "publicoAlvo.publicos": 0,
        "publicoAlvo.lista.headers": 0,
        "publicoAlvo.lista.dados": 0,
        perguntas: 0,
      })
      .lean();

    return demanda;
  }

  async find({ request, response, session }) {
    try {
      const { apenasColaborador } = request.all();
      const { id } = request.params;

      if (!id) {
        throw new exception("Id da demanda não informado!", 400);
      }

      //O hash do mongo deve ter, no máximo, 24 caracteres
      if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        throw new exception("Id da demanda inválido!", 400);
      }

      const demandaDB = await this.getDemandaById(id);

      if (!demandaDB) {
        return response.badRequest("Demanda não localizada!");
      }

      //se for passado o parametro apenasColaborador, verifica se o usuario logado
      //faz parte da lista de colaboradores da demanda
      if (apenasColaborador) {
        let dadosUsuario = session.get("currentUserAccount");
        let isColaborador = await isUserColaborador({
          idDemanda: id,
          matricula: dadosUsuario.chave,
          dadosUsuario,
        });

        if (!isColaborador) {
          return response.badRequest(
            "Você não faz parte da lista de autores desta demanda!"
          );
        }
      }

      const qtdRespostas = await respostasModel.countDocuments({
        idDemanda: new ObjectId(demandaDB.id),
      });
      const demanda = demandaDB.toJSON();
      demanda.jaRespondida = qtdRespostas > 0;

      return response.ok(demanda);
    } catch (err) {
      return response.badRequest(
        "Falha ao obter os dados da demanda solicitada."
      );
    }
  }

  /**
   * Metodo utilitario para obter todas as demandas de um colaborador especifico.
   * Ou todas as demandas cadastradas, no caso de usuário administrador e se este desejar.
   * @param {*} matriculaColaborador - matricula a ser pesquisada
   * @param {*} getArquivadas - obter apenas as demandas arquivadas
   * @param {*} showAll - mostrar
   */
  async _getByColaborador(
    matriculaColaborador,
    getArquivadas = false,
    showAll = false
  ) {
    let findQuery = { $match: { $and: [] } };

    if (!showAll) {
      findQuery.$match.$and.push({
        "colaboradores.matricula": matriculaColaborador,
      });
    }

    if (getArquivadas) {
      findQuery.$match.$and.push({ "geral.status": STATUS_DEMANDA.ENCERRADA });
    } else {
      //Todas, exceto as encerradas (status 3)
      findQuery.$match.$and.push({
        "geral.status": { $ne: STATUS_DEMANDA.ENCERRADA },
      });
    }

    let fields = {
      $addFields: {
        id: "$_id",
        dataExpiracao: {
          $convert: {
            input: "$geral.dataExpiracao",
            to: "date",
          },
        },
        titulo: "$geral.titulo",
        status: "$geral.statusText",
      },
    };

    let project = {
      $project: {
        geral: false,
        colaboradores: false,
        respostasDemanda: false,
        notificacoes: false,
        publicoAlvo: false,
        perguntas: false,
        totalConvites: false,
        totalLembretes: false,
        totalEnvioLembretes: false,
        enviandoConvites: false,
        enviandoLembretes: false,
        convitesEnviados: false,
      },
    };

    let sortFields = {
      $sort: { dataCriacao: -1 },
    };

    let demandas = await demandasModel.aggregate([
      findQuery,
      fields,
      project,
      sortFields,
    ]);
    return demandas;
  }

  async findAdm({ request, response, session }) {
    const params = request.allParams();

    if (
      !params.type ||
      (params.type != "ativas" && params.type != "arquivadas")
    ) {
      return response.badRequest(
        "Pesquisa possível somente para Ativas ou Arquivadas"
      );
    }

    let demandas = await this._getByColaborador(
      session.get("currentUserAccount").chave,
      params.type == "arquivadas",
      params.showAll === "true"
    );

    return response.ok(demandas);
  }

  async create({ request, response, session, params }) {
    const schema = {
      geral: "required|object",
      perguntas: "required|array",
      colaboradores: "required|array",
      publicoAlvo: "required|object",
      notificacoes: "required|object",
    };

    const {
      geral,
      perguntas,
      colaboradores,
      publicoAlvo,
      notificacoes,
    } = request.all();

    const validation = await validate(
      {
        geral,
        perguntas,
        colaboradores,
        publicoAlvo,
        notificacoes,
      },
      schema
    );

    if (validation.fails()) {
      throw new exception("Campos obrigatórios não foram informados!", 400);
    }

    if (publicoAlvo.tipoPublico === TIPOS_PUBLICOS.LISTA) {
      //garante que o atributo multiplaPorPrefixo seja true no caso de lista
      publicoAlvo.multiplaPorPrefixo = true;

      //faz uma passada nos dados para remover duplicatas.
      const hashList = [];
      const finalList = [];

      for (let register of publicoAlvo.lista.dados) {
        let hash = register.hash;
        if (!hashList.includes(hash)) {
          hashList.push(hash);
          finalList.push(register);
        }
      }

      if (finalList.length < publicoAlvo.lista.dados.length) {
        //existiam registros duplicados na lista original
        publicoAlvo.lista.dados = finalList;
      }
    }

    //criando uma nova demanda
    const demanda = new demandasModel({
      dataCriacao: moment().toDate(),
      geral,
      perguntas,
      colaboradores,
      publicoAlvo,
      notificacoes,
    });

    //salva a nova demanda
    await demanda.save();

    //criando o registro do historico
    if (demanda.isNew) {
      throw new exception(
        "Falha ao criar a demanda. Caso o mesmo persista, favor contatar o administrador do sistema.",
        400
      );
    }

    let dadosUsuario = session.get("currentUserAccount");
    let dadosResponsavel = {
      matricula: dadosUsuario.chave,
      nome: dadosUsuario.nome_usuario,
      nomeFuncao: dadosUsuario.nome_funcao,
    };

    //cria um novo registro de historico da criacao da demanda.
    await this.createHistorico(
      demanda.id,
      "Criação da demanda",
      demanda,
      dadosResponsavel
    );

    return response.ok({ id: demanda.id });
  }

  /**
   * Metodo utilitario para criacao de um registro no historico de alteracoes das demandas.
   * @param {*} idDemanda
   * @param {*} acao
   * @param {*} dadosDemanda
   * @param {*} dadosResponsavel
   */
  async createHistorico(idDemanda, acao, dadosDemanda, dadosResponsavel) {
    let historico = new historicoModel({
      dataRegistro: moment().toDate(),
      idDemanda,
      acao,
      dadosDemanda,
      dadosResponsavel,
    });

    await historico.save();
  }

  /**
   * Atualiza os dados de uma demanda.
   */
  async update({ request, response, session, params }) {
    const {
      id,
      geral,
      perguntas,
      colaboradores,
      publicoAlvo,
      notificacoes,
    } = request.allParams();

    if (!id) {
      return res.badRequest({ error: "Id da demanda não informado!" });
    }

    const schema = {
      geral: "required|object",
      perguntas: "required|array",
      colaboradores: "required|array",
      publicoAlvo: "required|object",
      notificacoes: "required|object",
    };

    const validation = await validate(
      {
        geral,
        perguntas,
        colaboradores,
        publicoAlvo,
        notificacoes,
      },
      schema
    );

    if (validation.fails()) {
      throw new exception("Campos obrigatórios não foram informados!", 400);
    }

    let dadosUsuario = session.get("currentUserAccount");
    let isColaborador = await isUserColaborador({
      idDemanda: id,
      matricula: dadosUsuario.chave,
      dadosUsuario,
    });

    if (!isColaborador) {
      return response.forbidden("Usuário não é colaborador desta demanda");
    }

    //Recuperar a demanda com o estado antes do salvamento
    let demandaAnterior = await demandasModel.findById(id);

    let arrayRemovidos = [];

    // ====== ====== ====== RESOLUÇÃO DAS QUESTÕES DE RESPOSTAS ====== ====== ======

    //Caso tenha ocorrido alteração do tipo de público-alvo, todas as respostas serão excluídas
    if (publicoAlvo.tipoPublico !== demandaAnterior.publicoAlvo.tipoPublico) {
      const removeQuery = { idDemanda: demandaAnterior.id };
      await respostasModel.remove(removeQuery);
      await respostasRascunhoModel.remove(removeQuery);

      //Tipo de público de planilha
    } else if (publicoAlvo.tipoPublico === TIPOS_PUBLICOS.LISTA) {
      let finalizadas = demandaAnterior.publicoAlvo.lista.finalizadas
        ? demandaAnterior.publicoAlvo.lista.finalizadas
        : [];

      const arrayHashsAtuais = demandaAnterior.publicoAlvo.lista.dados.map(
        (linha) => linha.hash
      );

      // Retirar eventuais novos identificadores do array de finalizados
      let arrayNovosHashs = publicoAlvo.lista.dados
        .filter((linha) => {
          return !arrayHashsAtuais.includes(linha.hash);
        })
        .map((linha) => linha["0"]);
      //Deve-se retirar do array de finalizadas as novas linhas
      publicoAlvo.lista.finalizadas = finalizadas.filter((finalizada) => {
        return !arrayNovosHashs.includes(finalizada);
      });

      //Quando um a linha tiver sido excluída, deve-se excluir as respostas para o identificador
      const arrayHashNovos = publicoAlvo.lista.dados.map((linha) => linha.hash);
      arrayRemovidos = arrayHashsAtuais.filter((hashAtual) => {
        return !arrayHashNovos.includes(hashAtual);
      });

      await this._excluirRespRemovidosLista(
        arrayRemovidos,
        id,
        dadosUsuario.chave
      );

      //Tipo de lista simples
    } else {
      let prefixosRemovidos = demandaAnterior.publicoAlvo.publicos.prefixos.filter(
        (prefixo) => {
          return !publicoAlvo.publicos.prefixos.includes(prefixo);
        }
      );

      let matriculasRemovidas = demandaAnterior.publicoAlvo.publicos.matriculas.filter(
        (matricula) => {
          return !publicoAlvo.publicos.matriculas.includes(matricula);
        }
      );

      await this._excluirRespRemovidosPublicos(
        { prefixos: prefixosRemovidos, matriculas: matriculasRemovidas },
        id
      );

      // Quando antes permitia várias respostas e deseja-se alterar pra reposta unica
      if (
        demandaAnterior.publicoAlvo.respostaUnica === false &&
        publicoAlvo.respostaUnica === true
      ) {
        let dadosUsuario = session.get("currentUserAccount");
        await this._excluirRespUnica(id, dadosUsuario.chave);
      }
    }

    // ====== ====== ======  FIM DA RESOLUÇÃO DAS QUESTÕES DE RESPOSTAS ====== ====== ======

    if (publicoAlvo.tipoPublico === TIPOS_PUBLICOS.LISTA) {
      //garante que o atributo multiplaPorPrefixo seja true no caso de lista
      publicoAlvo.multiplaPorPrefixo = true;

      //faz uma passada nos dados para remover possiveis duplicatas.
      const hashList = [];
      const finalList = [];

      for (let register of publicoAlvo.lista.dados) {
        let hash = register.hash;
        if (!hashList.includes(hash)) {
          hashList.push(hash);
          finalList.push(register);
        }
      }

      if (finalList.length < publicoAlvo.lista.dados.length) {
        //existiam registros duplicados na lista original
        publicoAlvo.lista.dados = finalList;
      }
    }

    //atualizando os dados da demanda
    let demanda = await demandasModel.findByIdAndUpdate(id, {
      geral,
      perguntas,
      colaboradores,
      publicoAlvo,
      notificacoes,
    });

    if (!demanda) {
      return response.badRequest(
        "Falha ao atualizar esta demanda! Aguarde e tente novamente."
      );
    }

    //criando o registro do historico
    if (demanda) {
      let dadosResponsavel = {
        matricula: dadosUsuario.chave,
        nome: dadosUsuario.nome_usuario,
        nomeFuncao: dadosUsuario.nome_funcao,
      };

      //cria um novo registro de historico da alteracao
      await this.createHistorico(
        id,
        "Alteração de dados da demanda",
        demandaAnterior,
        dadosResponsavel
      );
    }

    //obtem a demanda com o historico de alteracoes
    demanda = await this.getDemandaById(id);
    return response.ok({ id, historico: demanda.historico });
  }

  /**
   * Reativa uma demanda arquivada (ENCERARDA)
   * A rota ja possui o middlware IsUserColaborador para verificar se
   * o usuario logado é colaborador da demanda.
   * @param {*} param0
   */
  async arquivar({ request, response, session, params }) {
    let { id } = params;

    if (!id) {
      throw new exception("Id da demanda não informado!", 400);
    }

    //O has do mongo deve ter, no máximo, 24 caracteres
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      throw new exception("Formato do id inválido", 400);
    }

    const schema = {
      id: "required|string",
      matricula: "required|string",
    };

    let dadosUsuario = session.get("currentUserAccount");

    const validation = await validate(
      {
        id,
        matricula: dadosUsuario.chave,
      },
      schema
    );

    if (validation.fails()) {
      throw new exception("Campos obrigatórios não foram informados!", 400);
    }

    let demanda = await this.alteraStatusDemanda(id, STATUS_DEMANDA.ENCERRADA);
    return response.ok(demanda);
  }

  /**
   * Reativa uma demanda arquivada (ENCERARDA)
   * A rota ja possui o middlware IsUserColaborador para verificar se
   * o usuario logado é colaborador da demanda.
   * @param {*} param0
   */
  async reativar({ request, response, session, params }) {
    let { id } = params;

    if (!id) {
      throw new exception("Id da demanda não informado!", 400);
    }

    //O has do mongo deve ter, no máximo, 24 caracteres
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      throw new exception("Formato do id inválido", 400);
    }

    const schema = {
      id: "required|string",
      matricula: "required|string",
    };

    let dadosUsuario = session.get("currentUserAccount");

    const validation = await validate(
      {
        id,
        matricula: dadosUsuario.chave,
      },
      schema
    );

    if (validation.fails()) {
      throw new exception("Campos obrigatórios não foram informados!", 400);
    }

    let demanda = await this.alteraStatusDemanda(id, STATUS_DEMANDA.PUBLICADA);
    return response.ok(demanda);
  }

  /**
   * Metodo utilitario que altera o status da demanda
   * @param {*} id
   * @param {*} novoStatus
   */
  async alteraStatusDemanda(id, novoStatus) {
    let demanda = await demandasModel.findById(id);
    let novaDemanda = {};

    if (demanda) {
      demanda.geral.status = novoStatus;
      novaDemanda = await demandasModel.findByIdAndUpdate(id, {
        geral: demanda.geral,
      });
    }

    return novaDemanda;
  }

  /**
   * Faz a replicacao de demandas a partir de uma demanda base.
   */
  async duplicar({ request, response, session, params }) {
    let { id } = params;
    let { qtd } = request.all();

    if (!id) {
      throw new exception("Id da demanda não informado!", 400);
    }

    //O has do mongo deve ter, no máximo, 24 caracteres
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      throw new exception("Formato do id inválido", 400);
    }

    const schema = {
      id: "required|string",
      matricula: "required|string",
      qtd: "required|integer",
    };

    let dadosUsuario = session.get("currentUserAccount");

    const validation = await validate(
      {
        id,
        matricula: dadosUsuario.chave,
        qtd,
      },
      schema
    );

    if (validation.fails()) {
      throw new exception("Campos obrigatórios não foram informados!", 400);
    }

    let demandaOriginal = await demandasModel.findById(id);

    if (!demandaOriginal) {
      return response.badRequest("Demanda não encontrada na base!");
    }

    let novoTitulo =
      demandaOriginal.geral.titulo.search("Cópia") >= 0
        ? demandaOriginal.geral.titulo
        : demandaOriginal.geral.titulo + " (Cópia)";
    let dadosResponsavel = {
      matricula: dadosUsuario.chave,
      nome: dadosUsuario.nome_usuario,
      nomeFuncao: dadosUsuario.nome_funcao,
    };

    let novoPublicoAlvo = { ...demandaOriginal.publicoAlvo };

    if (novoPublicoAlvo.tipoPublico === TIPOS_PUBLICOS.LISTA) {
      delete novoPublicoAlvo.lista.finalizadas;
    }

    for (let i = 0; i < qtd; i++) {
      let demanda = new demandasModel({
        dataCriacao: moment().toDate(),
        perguntas: [...demandaOriginal.perguntas],
        colaboradores: [...demandaOriginal.colaboradores],
        publicoAlvo: novoPublicoAlvo,
        notificacoes: { ...demandaOriginal.notificacoes },
        geral: {
          ...demandaOriginal.geral,
          titulo: novoTitulo,
          status: STATUS_DEMANDA.EM_EDICAO,
          statusText: "Em edição",
        },
      });

      await demanda.save();

      //cria um novo registro de historico da criacao da demanda.
      await this.createHistorico(
        demanda.id,
        "Duplicação da demanda: " + demandaOriginal.geral.titulo,
        demandaOriginal,
        dadosResponsavel
      );
    }

    return response.ok("Demandas duplicadas com sucesso!");
  }

  /**
   * Metodo de uso exclusivo dos metodos findPendentesResposta e _getDemandasPublicos.   
   */
  async _getDemandasUsuario({chave, prefixo, removerExpiradas}) {
    let arrayAggregation = [
      {
        $addFields: {
          id: "$_id",
          dataExpiracao: {
            $convert: {
              input: "$geral.dataExpiracao",
              to: "date",
            }
          },
          titulo: "$geral.titulo"
        }
      },
      {
        $project: {
          __v: false,
          colaboradores: false,
          respostasDemanda: false,
          notificacoes: false,
          publicoAlvo: {lista: false},
          perguntas: false,
          totalConvites: false,
          totalLembretes: false,
          totalEnvioLembretes: false,
          enviandoConvites: false,
          enviandoLembretes: false,
          convitesEnviados: false,
        },
      }
    ];

    if (removerExpiradas) {
      arrayAggregation.push({ 
        $match: { "dataExpiracao": { $gte: new Date() } }          
      })
    }

    let filtroPublicos = {
      $match: {
        "publicoAlvo.tipoPublico": TIPOS_PUBLICOS.PUBLICOS        
      }
    };

    if (removerExpiradas) {
      filtroPublicos.$match["geral.status"] = STATUS_DEMANDA.PUBLICADA
    }

    arrayAggregation.push( 
      filtroPublicos,
      { 
        $match: {
          $or: [
            // { "publicoAlvo.publicos.prefixos": { $elemMatch: { $eq: prefixo } } },
            // { "publicoAlvo.publicos.matriculas": { $elemMatch: { $eq: chave } } },
            { "publicoAlvo.publicos.prefixos": prefixo },
            { "publicoAlvo.publicos.matriculas": chave },
          ],
        }
      },      
      {    
        $project: {
          geral: false,
          publicoAlvo: { publicos: false, matriculas: false, prefixos: false}
        }
      }      
    );

    let demandas = await demandasModel.aggregate(arrayAggregation);
    return demandas;
  }

  /**
   * Obtem lista de demandas pendentes de resposta para o usuario/dependencia.
   */
  async findPendentesResposta({ request, response, session, params }) {
    let dadosUsuario = session.get("currentUserAccount");

    let demandasPublicos = await this._getDemandasPublicos(dadosUsuario);    
    let demandasLista = await this._getDemandasLista(dadosUsuario);    

    let demandas = [...demandasPublicos, ...demandasLista];

    return response.ok(demandas);
  }

  /**
   * Obtem a lista das demandas ja respondidas pelo usuario/dependencia.
   */
  async findRespondidas({ response, session }) {
    let { prefixo, chave } = session.get("currentUserAccount");
    let demandas = await this._getDemandasUsuario({chave, prefixo, removerExpiradas: false});

    //obtendo a lista dos id's da demanda retornadas
    let listaIds = [];

    for (let demanda of demandas) {
      listaIds.push(demanda.id)
    }

    let respondidas = await respostasModel.find({ 
      idDemanda: { $in: listaIds }, 
      $and: [{
        $or: [ {matriculaAutor: chave}, {prefixoAutor: prefixo} ]
      }]
    }, { respostas: false}).lean();

    const demandasPublicosRespondidas = [];

    for (let demanda of demandas) {
      for (let resposta of respondidas) {
        let idDemanda = demanda.id.toString();
        let idDemResposta = resposta.idDemanda.toString();

        if (idDemanda === idDemResposta) {
          if (demanda.publicoAlvo.multiplaPorPrefixo === false) {
            if (resposta.prefixoAutor === prefixo) {
              demandasPublicosRespondidas.push(demanda);
            }
          } else if (resposta.matriculaAutor === chave) {
            demandasPublicosRespondidas.push(demanda);
          }
        }
      }
    }

    //obtendo as demandas respondidas do tipo lista
    const demandasListaRespondidas = await demandasModel.aggregate([      
      {
        $project: {
          __v: false,
          colaboradores: false,          
          notificacoes: false,
          perguntas: false,
          totalConvites: false,
          totalLembretes: false,
          totalEnvioLembretes: false,
          enviandoConvites: false,
          enviandoLembretes: false,
          convitesEnviados: false,
        }
      },
      {
        $match: {
          "publicoAlvo.tipoPublico": TIPOS_PUBLICOS.LISTA, // Filtra as demandas cujo tipo seja "lista"
          "geral.status": STATUS_DEMANDA.PUBLICADA, // Filtra somente as publicadas
          $and: [
            {
              $or: [
                { "publicoAlvo.lista.dados": { $elemMatch: { 0: prefixo } } },
                { "publicoAlvo.lista.dados": { $elemMatch: { 0: chave } } }
              ],
            },
            {
              "publicoAlvo.lista.finalizados": {
                $in: [prefixo, chave]
              }
            }
          ]
        }
      },
      {
        $addFields: {
          id: "$_id",
          dataExpiracao: {
            $convert: {
              input: "$geral.dataExpiracao",
              to: "date",
            },
          },
          titulo: "$geral.titulo",
        },
      },
      {
        $project: {
          geral: false,
          publicoAlvo: false,
        }
      },
    ]);

    let demandasFiltradas = [...demandasPublicosRespondidas, ...demandasListaRespondidas];
    response.ok(demandasFiltradas);
  }

  async findRespostasAnteriores({ request, response, session, params }) {
    const { idDemanda } = request.allParams();
    if (!idDemanda) {
      throw new exception(`Id da demanda não informado!"`, 400);
    }

    const user = session.get("currentUserAccount");

    if (idDemanda.length != 24) {
      throw new exception(`ID inválido!"`, 400);
    }

    let demanda = await demandasModel.findById(idDemanda);
    let isPublicoAlvoPorPrefixo = await isPublicoAlvo({
      prefixo: user.prefixo,
      idDemanda
    });

    let respostas = null;

    if (isPublicoAlvoPorPrefixo) {
      //verifica se ja possui alguma resposta registrada caso nao permita multiplas respostas.
      if (demanda.publicoAlvo.multiplaPorPrefixo === false) {
        //verifica se ja existe uma reposta para este prefixo.
        //nao deve permiir caso o flag multipla seja definido como false
        respostas = await respostasModel.find({
          idDemanda,
          prefixoAutor: user.prefixo
        }).lean();        
      } 
    } 
    
    if (!respostas) {
      respostas = await respostasModel
      .find({ idDemanda, matriculaAutor: user.chave })
      .lean();
    }

    response.ok(respostas);
  }

  /**
   *
   * Realiza uma busca pelos dados de resposta de uma demanda
   * pelo usuario logado. Se nao encontrar pesquisa na collection de rascunho.
   *
   */

  async findResponse({ request, response, session }) {
    const { idDemanda, hashLista } = request.allParams();

    if (!idDemanda) {
      throw new exception(`Id da demanda não informado!"`, 400);
    }

    if (idDemanda.length != 24) {
      throw new exception(`ID inválido!"`, 400);
    }

    let dadosUsuario = session.get("currentUserAccount");
    let demanda = await demandasModel.findById(idDemanda);
    let isPublicoAlvoPorPrefixo = await isPublicoAlvo({
      prefixo: dadosUsuario.prefixo,
      idDemanda,
    });

    if (isPublicoAlvoPorPrefixo) {
      //verifica se ja possui alguma resposta registrada caso nao permita multiplas respostas.
      if (demanda.publicoAlvo.multiplaPorPrefixo === false) {
        //verifica se ja existe uma reposta para este prefixo.
        //nao deve permiir caso o flag multipla seja definido como false
        let respostasPrefixo = await respostasModel.find({
          idDemanda,
          prefixoAutor: dadosUsuario.prefixo,
        });

        if (respostasPrefixo.length) {
          //ja possui uma resposta para este prefixo, retorna a mesma para todos os
          //funcis do prefixo
          return response.ok(respostasPrefixo[0]);
        }
      }
    }

    let respostas;

    if (hashLista) {
      //buscando resposta vinda do modulo Lista
      respostas = await respostasModel
        .findOne({ idDemanda, identificador: hashLista })
        .lean();
    } else {
      respostas = await respostasModel
        .findOne({ idDemanda, matriculaAutor: dadosUsuario.chave })
        .lean();
    }

    if (!respostas) {
      //procura nos rascunhos
      if (hashLista) {
        //buscando rascunho vindo do modulo Lista
        respostas = await respostasRascunhoModel.findOne({
          idDemanda,
          identificador: hashLista,
        });
      } else {
        respostas = await respostasRascunhoModel.findOne({
          idDemanda,
          matriculaAutor: dadosUsuario.chave,
        });
      }

      if (!respostas) {
        return response.ok({});
      }
    }

    return response.ok(respostas);
  }

  /**
   *
   * Registra os dados de finalizacao da resposta.
   *
   */

  async registerResponse({ request, response, session }) {
    const { respostas, idDemanda, hashLista } = request.allParams();

    const schema = {
      idDemanda: "required|string",
      respostas: "required|object",
    };

    const validation = await validate(
      {
        idDemanda,
        respostas,
      },
      schema
    );

    if (validation.fails()) {
      throw new exception(
        "Função salvar elogios não recebeu todos os parâmetros obrigatórios",
        400
      );
    }

    //tudo ok, continuando...
    let dadosUsuario = session.get("currentUserAccount");

    //VALIDACOES
    let respostasAnteriores;

    //verfica se a reposta ja foi regitrada para este usuario.. evita duplicidade
    if (!_.isEmpty(hashLista)) {
      respostasAnteriores = await respostasModel.find({
        idDemanda,
        identificador: hashLista,
      });
    } else {
      respostasAnteriores = await respostasModel.find({
        idDemanda,
        matriculaAutor: dadosUsuario.chave,
      });
    }

    const demandaPesquisada = await demandasModel.findById(idDemanda);
    if (respostasAnteriores.length) {
      if (!_.isEmpty(hashLista)) {
        throw new exception(
          "Resposta já registrada para esta ocorrência!",
          400
        );
      } else if (demandaPesquisada.publicoAlvo.respostaUnica) {
        throw new exception(
          `Resposta já registrada para matrícula: ${dadosUsuario.chave}!`,
          400
        );
      }
    }

    let demanda = await this._getDadosBasicosDemanda(idDemanda);
    let isPublicoAlvoPorPrefixo = await isPublicoAlvo({
      prefixo: dadosUsuario.prefixo,
      idDemanda,
    });

    if (
      isPublicoAlvoPorPrefixo &&
      demanda.publicoAlvo.multiplaPorPrefixo === false
      && demanda.publicoAlvo.tipoPublico !== TIPOS_PUBLICOS.LISTA
    ) {
      //verifica se ja existe uma reposta para este prefixo.
      //nao deve permiir caso o flag multipla seja definido como false
      respostasAnteriores = await respostasModel.find({
        idDemanda,
        prefixoAutor: dadosUsuario.prefixo,
      });

      if (respostasAnteriores.length) {
        //ja possui uma resposta para este prefixo
        throw new exception(
          "Permitida apenas uma resposta por prefixo para esta demanda!",
          400
        );
      }
    }
    //FIM DAS VALIDACOES

    let respData = {
      dataRegistro: moment().toDate(),
      idDemanda,
      respostas,
      matriculaAutor: dadosUsuario.chave,
      prefixoAutor: dadosUsuario.prefixo,
      dadosAutor: dadosUsuario,
    };

    if (!_.isEmpty(hashLista)) {
      respData.identificador = hashLista;
    }

    const createData = new respostasModel(respData);

    //incluindo novo registro de respostas
    await createData.save();

    if (createData.isNew) {
      throw new exception("Erro ao salvar a resposta!", 500);
    }

    //Respostas registradas. Excluindo o rascunho...
    //Nao deveria ter mais de um, however...
    if (!_.isEmpty(hashLista)) {
      await respostasRascunhoModel.deleteMany({
        idDemanda,
        identificador: hashLista,
      });
    } else {
      await respostasRascunhoModel.deleteMany({
        idDemanda,
        matriculaAutor: dadosUsuario.chave,
      });
    }

    //assume que todas as respostas foram finalizadas.
    //o trecho abaixo vai provar o contrario se for o caso.
    let finalizado = true;

    if (!_.isEmpty(hashLista)) {
      //verifica se respondeu todas as ocorrencias da qual eh publico-alvo
      demanda = await demandasModel.findById(idDemanda);
      let { lista } = demanda.publicoAlvo;
      let identificador = "";

      for (const registro of lista.dados) {
        if (
          registro[0].trim() === dadosUsuario.chave ||
          registro[0].trim() === dadosUsuario.prefixo
        ) {
          if (registro[0].trim() === dadosUsuario.chave) {
            identificador = dadosUsuario.chave;
          }

          if (registro[0].trim() === dadosUsuario.prefixo) {
            identificador = dadosUsuario.prefixo;
          }

          let respondeu = await respostasModel
            .find({ idDemanda, identificador: registro.hash })
            .countDocuments();

          if (respondeu === 0) {
            finalizado = false;
            break;
          }
        }
      }

      //verifica se finalizou a resposta de todas as ocorrencias
      if (finalizado) {
        //salva o identificador na relacao de finalizados da lista
        let arrayFinalizadas = demanda.publicoAlvo.lista.finalizadas
          ? demanda.publicoAlvo.lista.finalizadas
          : [];

        if (!arrayFinalizadas.includes(identificador)) {
          arrayFinalizadas.push(identificador);
        }

        const updateData = {
          ...demanda.publicoAlvo,
          lista: {
            ...demanda.publicoAlvo.lista,
            finalizadas: arrayFinalizadas
          },
        };

        //inclui o identificador na lista de finalizados da lista
        await demandasModel.findByIdAndUpdate(idDemanda, {
          publicoAlvo: updateData
        });
      }
    }

    if (_.isEmpty(hashLista) || finalizado) {
      //Enviando o email de agradecimento ao usuario
      const dadosMensagem = demanda.notificacoes.agradecimento;
      const tituloTag = "{tituloDemanda}";
      let tituloMensagem = dadosMensagem.titulo.replace(
        tituloTag,
        '"' + demanda.geral.titulo + '"'
      );
      let corpoMensagem = dadosMensagem.conteudo.replace(
        tituloTag,
        '"' + demanda.geral.titulo + '"'
      );

      let enviouEmail = await sendMail({
        from: DEFAULT_REMETENTE_EMAILS,
        to: dadosUsuario.email.toLowerCase(),
        subject: tituloMensagem,
        body: corpoMensagem,
      });

      if (enviouEmail) {
        let notificacao = new notificacoesModel({
          idDemanda,
          tipoEnvio: TIPOS_NOTIFICACAO.AGRADECIMENTO,
          dataEnvio: moment().toDate(),
          matriculaEnvio: "SISTEMA",
          emailRemetente: DEFAULT_REMETENTE_EMAILS,
          destinatario: dadosUsuario.chave,
          emailDestinatario: dadosUsuario.email.toLowerCase(),
        });

        await notificacao.save();
      }
    }

    return response.ok({
      dataRegistro: createData.dataRegistro,
      dadosAutor: createData.dadosAutor,
    });
  }

  async sendInvitationsEmails({ request, response, session, params }) {
    let { idDemanda } = params;

    if (!idDemanda) {
      throw new exception(`Id da demanda não informado!`, 400);
    }

    let demanda = await demandasModel.findById(idDemanda);
    if (!demanda) {
      throw new exception(`Demanda não localizada!`, 400);
    }

    if (demanda.enviandoConvites) {
      throw new exception(
        `Estão sendo enviados convites para esta demanda. Aguarde o término do envio.`,
        400
      );
    }

    //verifica se a demanda encontra-se no status de publicada
    if (demanda.geral.status !== STATUS_DEMANDA.PUBLICADA) {
      throw new exception(
        `Status da demanda não permite envio dos convites!`,
        400
      );
    }

    try {
      // ****  Marca como iniciado o envio de convites   ****//
      await demandasModel.findByIdAndUpdate(idDemanda, {
        enviandoConvites: true,
      });
      let {
        listaDestinatarios,
        listaPrefixosDestin,
      } = await this._getPublicoAlvo(demanda);

      const dadosLembrete = demanda.notificacoes.convite;
      const tituloTag = "{tituloDemanda}";
      let tituloConvite = dadosLembrete.titulo.replace(
        tituloTag,
        demanda.geral.titulo
      );
      let mensagemConvite = dadosLembrete.conteudo.replace(
        tituloTag,
        demanda.geral.titulo
      );

      //inclui o link do formulario na mensagem
      const linkDemanda =
        FRONTEND_URL + "demandas/responder-demanda/" + idDemanda;
      mensagemConvite +=
        '<br /><br /><div style="padding:5px; width:100%; text-align:center;">';
      mensagemConvite += `<a href="${linkDemanda}" target="_blank">Clique aqui para responder o formulário</a>`;
      mensagemConvite += "</div>";

      let totalDestin = listaDestinatarios.length + listaPrefixosDestin.length;
      let dadosUsuario = session.get("currentUserAccount");

      //grava o total de destinatarios na demanda antes de enviar os convites
      await demandasModel.findByIdAndUpdate(idDemanda, {
        totalConvites: totalDestin,
      });

      //loop principal de envio dos emails dos convites aos FUNCIS
      for (const funci of listaDestinatarios) {
        let enviou = await notificacoesModel.findOne({
          idDemanda: new ObjectId(idDemanda),
          tipoEnvio: TIPOS_NOTIFICACAO.CONVITE,
          destinatario: funci.matricula,
        });

        if (!enviou) {
          //destinatario ainda nao recebeu o convite..
          let enviouEmail = await sendMail({
            from: DEFAULT_REMETENTE_EMAILS,
            to: funci.email.toLowerCase(),
            subject: tituloConvite,
            body: mensagemConvite,
          });

          if (enviouEmail) {
            let notificacaoFunci = new notificacoesModel({
              idDemanda,
              tipoEnvio: TIPOS_NOTIFICACAO.CONVITE,
              dataEnvio: moment().toDate(),
              matriculaEnvio: dadosUsuario.chave,
              emailRemetente: dadosUsuario.email.toLowerCase(),
              destinatario: funci.matricula,
              cicloLembrete: demanda.totalEnvioLembretes,
              emailDestinatario: funci.email.toLowerCase(),
            });

            await notificacaoFunci.save();

            if (notificacaoFunci.isNew) {
              throw new exception(
                `Erro ao salvar notificação no banco de dados`,
                500
              );
            }
          }
        }
      }
      //loop principal de envio dos emails dos convites as DEPENDENCIAS
      for (const depend of listaPrefixosDestin) {
        let enviou = await notificacoesModel.findOne({
          idDemanda: new ObjectId(idDemanda),
          tipoEnvio: TIPOS_NOTIFICACAO.CONVITE,
          destinatario: depend.prefixo,
        });

        if (!enviou) {
          // destinatario ainda nao recebeu o convite..
          let enviouEmail = await sendMail({
            from: DEFAULT_REMETENTE_EMAILS,
            to: depend.email.toLowerCase(),
            subject: tituloConvite,
            body: mensagemConvite,
          });

          if (enviouEmail) {
            let notificacaoDep = new notificacoesModel({
              idDemanda,
              tipoEnvio: TIPOS_NOTIFICACAO.CONVITE,
              dataEnvio: moment().toDate(),
              matriculaEnvio: dadosUsuario.chave,
              emailRemetente: dadosUsuario.email.toLowerCase(),
              destinatario: depend.prefixo,
              emailDestinatario: depend.email.toLowerCase(),
            });

            await notificacaoDep.save();
            if (notificacaoDep.isNew) {
              throw new exception(
                `Erro ao salvar notificação no banco de dados`,
                500
              );
            }
          }
        }
      }

      //inclui flag na demanda indicando que os convites ja foram enviados
      await demandasModel.findByIdAndUpdate(idDemanda, {
        convitesEnviados: true,
      });

      await historicoNotificacoesModel.create({
        dataRegistro: moment().toDate(),
        tipoEnvio: TIPOS_NOTIFICACAO.CONVITE,
        dadosResponsavel: {
          matricula: dadosUsuario.chave,
          nome: dadosUsuario.nome_usuario,
          nome_guerra: dadosUsuario.nome_guerra,
          prefixo: dadosUsuario.prefixo,
          nomePrefixo: dadosUsuario.dependencia,
        },
        idDemanda,
      });

      // ****  Marca como terminado o envio de convites   ****//
      await demandasModel.findByIdAndUpdate(idDemanda, {
        enviandoConvites: false,
      });

      return response.ok(totalDestin);
    } catch (err) {
      // ****  Marca como terminado o envio de convites   ****//
      await demandasModel.findByIdAndUpdate(idDemanda, {
        enviandoConvites: false,
      });
      return response.badRequest("Erro ao enviar os convites!");
    }
  }

  async sendRemindersEmails({ request, response, session, params }) {
    let { idDemanda } = params;

    if (!idDemanda) {
      throw new exception(`Id da demanda não informado!`, 400);
    }

    let demanda = await demandasModel.findById(idDemanda);

    if (!demanda) {
      throw new exception(`Demanda não localizada!`, 400);
    }

    //verifica se a demanda encontra-se no status de publicada
    if (demanda.geral.status !== STATUS_DEMANDA.PUBLICADA) {
      throw new exception(
        `Status da demanda não permite envio dos lembretes!`,
        400
      );
    }

    //verifica se nao extrapolou o limite de envio de lembretes para a demanda
    if (
      demanda.totalEnvioLembretes &&
      demanda.totalEnvioLembretes === MAX_ENVIO_LEMBRETES
    ) {
      throw new exception(
        `A demanda atual já atingiu o máximo permitido para o envio de lembretes - [${MAX_ENVIO_LEMBRETES}]!`,
        400
      );
    }

    if (demanda.enviandoLembretes) {
      throw new exception(
        `Estão sendo enviados lembretes para esta demanda. Aguarde o término do envio.`,
        400
      );
    }
    // ****  Marca como enviando Lembretes   ****//
    try {
      await demandasModel.findByIdAndUpdate(idDemanda, {
        enviandoLembretes: true,
      });
      let {
        listaDestinatarios,
        listaPrefixosDestin,
      } = await this._getPublicoAlvo(demanda);

      const dadosLembrete = demanda.notificacoes.lembrete;
      const tituloTag = "{tituloDemanda}";
      let tituloMensagem = dadosLembrete.titulo.replace(
        tituloTag,
        demanda.geral.titulo
      );
      let corpoMensagem = dadosLembrete.conteudo.replace(
        tituloTag,
        demanda.geral.titulo
      );
      //inclui o link do formulario na mensagem
      const linkDemanda =
        FRONTEND_URL + "demandas/responder-demanda/" + idDemanda;
      corpoMensagem +=
        '<br /><br /><div style="padding:5px; width:100%; text-align:center;">';
      corpoMensagem += `<a style="font-size: 150%;" href="${linkDemanda}" target="_blank">Clique aqui para responder o formulário</a>`;
      corpoMensagem += "</div>";

      let totalDestin = listaDestinatarios.length + listaPrefixosDestin.length;
      let dadosUsuario = session.get("currentUserAccount");
      //grava o total de destinatarios na demanda antes de enviar os lembretes
      await demandasModel.findByIdAndUpdate(idDemanda, {
        totalLembretes: totalDestin,
      });

      //loop principal de envio dos emails dos lembretes aos FUNCIS
      for (const funci of listaDestinatarios) {
        //verifica se o funci ainda nao respondeu a demanda
        let respondeu = await respostasModel.findOne({
          idDemanda: new ObjectId(idDemanda),
          matriculaAutor: funci.matricula,
        });

        //Verifica se o funci já recebeu notificação neste ciclo
        if (!respondeu || !demanda.publicoAlvo.respostaUnica) {
          let enviouEmail = await sendMail({
            from: DEFAULT_REMETENTE_EMAILS,
            to: funci.email.toLowerCase(),
            subject: tituloMensagem,
            body: corpoMensagem,
          });

          if (enviouEmail) {
            let notificacao = new notificacoesModel({
              idDemanda,
              tipoEnvio: TIPOS_NOTIFICACAO.LEMBRETE,
              dataEnvio: moment().toDate(),
              matriculaEnvio: dadosUsuario.chave,
              emailRemetente: dadosUsuario.email,
              destinatario: dadosUsuario.chave,
              matriculaDestinatario: funci.matricula,
              emailDestinatario: funci.email,
              cicloLembrete: demanda.totalEnvioLembretes,
            });

            await notificacao.save();

            if (notificacao.isNew) {
              throw new exception(
                `Erro ao salvar notificação no banco de dados`,
                500
              );
            }
          }
        }
      }

      //loop principal de envio dos emails dos lembretes das DEPENDENCIAS
      for (const depend of listaPrefixosDestin) {
        let jaRespondeu = false;

        //Caso seja do tipo publicos e múltiplo por prefixos, significa que só haverão Dependências no público alvo
        // Caso seja do tipo lista, significa que poderão haver prefixos e matrículas no público

        let { multiplaPorPrefixo, tipoPublico } = demanda.publicoAlvo;

        if (
          multiplaPorPrefixo === false &&
          tipoPublico === TIPOS_PUBLICOS.PUBLICOS
        ) {
          jaRespondeu = await respostasModel.findOne({
            idDemanda: new ObjectId(idDemanda),
            prefixoAutor: depend.prefixo,
          });
        } else if (tipoPublico === TIPOS_PUBLICOS.LISTA) {
          let demandaTemp = await demandasModel.findOne({
            _id: new ObjectId(idDemanda),
          });
          jaRespondeu = demandaTemp.publicoAlvo.lista.finalizadas.includes(
            depend.prefixo
          );
        }

        if (!jaRespondeu) {
          let mailData = {
            from: DEFAULT_REMETENTE_EMAILS,
            to: depend.email.toLowerCase(),
            subject: tituloMensagem,
            body: corpoMensagem,
          };
          let enviouEmail = await sendMail(mailData);

          if (enviouEmail) {
            let notificacao = new notificacoesModel({
              idDemanda,
              tipoEnvio: TIPOS_NOTIFICACAO.LEMBRETE,
              dataEnvio: moment().toDate(),
              matriculaEnvio: dadosUsuario.chave,
              emailRemetente: dadosUsuario.email,
              destinatario: depend.prefixo,
              emailDestinatario: depend.email,
            });

            await notificacao.save();

            if (notificacao.isNew) {
              throw new exception(
                `Erro ao salvar notificação no banco de dados`,
                500
              );
            }
          } else {
            Logger.transport("mail_errors").error({
              timestamp: moment().format(),
              ip: request.ip(),
              ferramenta: "Demandas.sendReminders",
              mailData,
            });
          }
        }
      }

      let totalEnvioLembretes = demanda.totalEnvioLembretes
        ? demanda.totalEnvioLembretes + 1
        : 1;
      //Incrementa o total de envio de lembretes ja enviados
      await demandasModel.findByIdAndUpdate(idDemanda, { totalEnvioLembretes });

      await historicoNotificacoesModel.create({
        dataRegistro: moment().toDate(),
        tipoEnvio: TIPOS_NOTIFICACAO.LEMBRETE,
        dadosResponsavel: {
          matricula: dadosUsuario.chave,
          nome: dadosUsuario.nome_usuario,
          nome_guerra: dadosUsuario.nome_guerra,
          prefixo: dadosUsuario.prefixo,
          nomePrefixo: dadosUsuario.dependencia,
        },
        idDemanda,
      });

      // ****  Desmarca o flag de enviando lembretes   ****//
      await demandasModel.findByIdAndUpdate(idDemanda, {
        enviandoLembretes: false,
      });

      return response.ok(totalDestin);
    } catch (err) {
      await demandasModel.findByIdAndUpdate(idDemanda, {
        enviandoLembretes: false,
      });
      return response.badRequest({
        error: "Parâmetros obrigatórios não foram informados!",
        err,
      });
    }
  }

  async getRespostasCsv({ request, response }) {
    const allParams = request.allParams();
    const { idDemanda, delimiter, outputFormat } = allParams;

    const csvDelimiter = delimiter ? delimiter : ";";
    const exportFormat = outputFormat ? outputFormat : "xls";

    let demanda = await demandasModel
      .findById(idDemanda)
      .populate({
        path: "respostas",
        model: respostasModel,
      })
      .lean();

    if (allParams["apenasFinalizadas"] !== "undefined") {
      //vem como string do frontend, mesmo passando como boolean
      allParams.apenasFinalizadas = allParams.apenasFinalizadas &&
        allParams.apenasFinalizadas.toLowerCase() === "true";
    }

    let dadosRespostas = [];
    const isTipoPublicoLista =
      demanda.publicoAlvo.tipoPublico === TIPOS_PUBLICOS.LISTA;
    let listaHashsFinalizados = [];
    let resumoDados = {};

    try {
      if (isTipoPublicoLista) {
        resumoDados = this._getResumoRegistrosLista(demanda.publicoAlvo.lista);
        let finalizadas = [];

        if (demanda.publicoAlvo.lista.finalizadas) {
          finalizadas = [...demanda.publicoAlvo.lista.finalizadas];
        }

        for (let i = 0; i < finalizadas.length; i++) {
          let key = finalizadas[i];

          if (resumoDados[key]) {
            let idsList = resumoDados[key].dados.map((elem) => elem.hash);
            listaHashsFinalizados = listaHashsFinalizados.concat(idsList);
          }
        }
      }

      _.forEach(demanda.respostas, (registro) => {
        let linhaCsv = [];
        let podeAdicionarRegistro = isTipoPublicoLista ? false : true;

        linhaCsv.push(
          moment(registro.dataRegistro).format("DD/MM/YYYY HH:mm"),
          registro.dadosAutor.chave,
          registro.dadosAutor.nome_usuario,
          registro.dadosAutor.prefixo,
          registro.dadosAutor.dependencia
        );

        //verifica se a demanda utilizou o modulo lista e insere os dados do usuario
        if (isTipoPublicoLista) {
          let listaRegistros = [];

          if (resumoDados[registro.prefixoAutor]) {
            listaRegistros = resumoDados[registro.prefixoAutor].dados;
          } else if (resumoDados[registro.matriculaAutor]) {
            listaRegistros = resumoDados[registro.matriculaAutor].dados;
          }

          let itemSize = demanda.publicoAlvo.lista.headers.length;

          for (let i = 0; i < listaRegistros.length; i++) {
            let item = listaRegistros[i];

            if (!allParams.apenasFinalizadas) {
              //procura o hash da resposta no array dos dados da lista
              if (
                registro.identificador &&
                item.hash === registro.identificador
              ) {
                for (let j = 1; j < itemSize; j++) {
                  linhaCsv.push(item[j]);
                }

                //encontrou o hash correspondente, pode encerrar a busca
                podeAdicionarRegistro = true;
                break;
              }
            } else {
              //busca apenas os registros em ocorrencias finalizadas
              if (
                registro.identificador &&
                item.hash === registro.identificador &&
                listaHashsFinalizados.includes(registro.identificador)
              ) {
                for (let j = 1; j < itemSize; j++) {
                  linhaCsv.push(item[j]);
                }

                //encontrou o hash correspondente, pode encerrar a busca
                podeAdicionarRegistro = true;
                break;
              }
            }
          }
        }

        if (podeAdicionarRegistro) {
          let linhaPerguntas = demanda.perguntas.map((pergunta) => {
            return registro.respostas[pergunta.id] === undefined
              ? " *** Não respondida ***"
              : registro.respostas[pergunta.id].value;
          });

          linhaCsv = linhaCsv.concat(linhaPerguntas);
          dadosRespostas.push(linhaCsv);
        }
      });

      let headers = [
        "Data da Resposta",
        "Matricula",
        "Respondente",
        "Prefixo",
        "Dependência",
      ];

      if (demanda.publicoAlvo.tipoPublico === TIPOS_PUBLICOS.LISTA) {
        let headersLista = demanda.publicoAlvo.lista.headers;
        //insere os headers do usuario inseridos no modulo lista
        for (let i = 1; i < headersLista.length; i++) {
          headers.push(headersLista[i]);
        }
      }

      const fieldsPerguntas = demanda.perguntas.map(
        (pergunta) => pergunta.texto
      );
      headers = headers.concat(fieldsPerguntas);

      let arquivoExportado = await jsonExport.convert({
        dadosJson: dadosRespostas,
        headers,
        type: exportFormat,
        delimiter: csvDelimiter,
        headerTitle: demanda.geral.titulo,
      });

      await jsonExport.download(response, arquivoExportado);
    } catch (err) {
      throw new exception(err.message, 400);
    }
  }

  async getEstatisticasDemanda({ request, response }) {
    const { idDemanda } = request.allParams();
    const demanda = await this._getDadosBasicosDemanda(idDemanda);
    let estatisticas;

    switch (demanda.publicoAlvo.tipoPublico) {
      case TIPOS_PUBLICOS.PUBLICOS:
        estatisticas = await this._getEstatisticasDefault(idDemanda);
        break;

      case TIPOS_PUBLICOS.LISTA:
        estatisticas = await this._getEstatisticasLista(idDemanda);
        break;
    }

    response.ok(estatisticas);
  }

  /**
   * Calcula os valores das estatisticas do publico-alvo do tipo Lista de uma
   * demanda.
   */
  async _getEstatisticasLista(idDemanda) {
    const demanda = await demandasModel.findById(idDemanda);

    let estatisticas = {
      countDown: demanda.geral.dataExpiracao,
    };

    const registrosUnicos = [];
    const { dados } = demanda.publicoAlvo.lista;
    const resumoDados = {};

    for (const elem of dados) {
      let key = elem[0];
      if (!registrosUnicos.includes(key)) {
        registrosUnicos.push(key);
      }

      if (resumoDados[key]) {
        resumoDados[key].push(elem.hash);
      } else {
        resumoDados[key] = [elem.hash];
      }
    }

    estatisticas.publicoTotal = registrosUnicos.length;

    //calculando as finalizadas
    const resumoKeys = Object.keys(resumoDados);
    let totalFinalizadas = 0;
    let totalOcorrencias = 0;
    let totalOcorrenciasFinalizadas = 0;

    for (const key of resumoKeys) {
      let totalRespostas = await respostasModel
        .find({
          idDemanda,
          identificador: { $in: resumoDados[key] },
        })
        .countDocuments();

      totalOcorrencias += resumoDados[key].length;
      totalOcorrenciasFinalizadas += totalRespostas;

      if (totalRespostas === resumoDados[key].length) {
        //so considera finalizada se foram respondidas
        //todas as ocorrencias
        totalFinalizadas += 1;
      }
    }

    estatisticas.finalizadas = totalFinalizadas;
    estatisticas.pendentes = estatisticas.publicoTotal - totalFinalizadas;
    estatisticas.totalOcorrencias = totalOcorrencias;
    estatisticas.totalOcorrenciasFinalizadas = totalOcorrenciasFinalizadas;
    estatisticas.totalOcorrenciasPendentes =
      totalOcorrencias - totalOcorrenciasFinalizadas;

    return estatisticas;
  }

  /**
   * Calcula os valores das estatisticas do publico-alvo default (Publicos) de uma
   * demanda.
   */
  async _getEstatisticasDefault(idDemanda) {
    const demanda = await demandasModel.findById(idDemanda).populate({
      path: "respostas",
      model: respostasModel,
    });

    let estatisticas = {
      countDown: demanda.geral.dataExpiracao,
    };

    //Caso multipla por prefixo
    if (demanda.publicoAlvo.multiplaPorPrefixo === true) {
      //Caso existam prefixos, precisa resolver os prefixo em lista de matrículas
      if (
        demanda.publicoAlvo.publicos.prefixos &&
        demanda.publicoAlvo.publicos.prefixos.length > 0
      ) {
        let qtdFuncisDep = await funciModel
          .query()
          .select("matricula")
          .whereIn("ag_localiz", demanda.publicoAlvo.publicos.prefixos)
          .whereNotIn("matricula", demanda.publicoAlvo.publicos.matriculas)
          .getCount();
        estatisticas.publicoTotal =
          qtdFuncisDep + demanda.publicoAlvo.publicos.matriculas.length;
        //Caso não haja prefixo, o público total é a quantidade de matrícula
      } else {
        estatisticas.publicoTotal =
          demanda.publicoAlvo.publicos.matriculas.length;
      }

      //Caso não aceite multiplos por prefixo, cada prefixo é considerado uma resposta
      //Desconsidera o array de matriculas, pois as duas opcoes nao podem coexistir quando
      //nao permite multiplas por prefixo. Caso existam dados, deve ser uma demanda antiga,
      //criada antes da implementacao desta regra.
    } else {
      estatisticas.publicoTotal = demanda.publicoAlvo.publicos.prefixos
        ? demanda.publicoAlvo.publicos.prefixos.length
        : 0;
    }

    let finalizadas = await respostasModel.find({ idDemanda });
    estatisticas.finalizadas = finalizadas.length;
    estatisticas.pendentes =
      estatisticas.publicoTotal - estatisticas.finalizadas;

    return estatisticas;
  }

  async getHistoricoNotificacoes({ request, response }) {
    const { idDemanda } = request.allParams();
    const historicoNotificacoes = await historicoNotificacoesModel
      .find({
        idDemanda: new ObjectId(idDemanda),
      })
      .sort({ dataRegistro: "desc" });
    return response.ok(historicoNotificacoes);
  }

  async getStatusNotificacoes({ request, response }) {
    const { idDemanda } = request.allParams();
    const demanda = await demandasModel.findById(idDemanda);
    const convites = await notificacoesModel.find({
      idDemanda,
      tipoEnvio: TIPOS_NOTIFICACAO.CONVITE,
    });
    const lembretes = await notificacoesModel.find({
      idDemanda,
      tipoEnvio: TIPOS_NOTIFICACAO.LEMBRETE,
      cicloLembrete: demanda.totalEnvioLembretes,
    });

    let statusNotificacoes = {
      convites: {
        convitesEnviados: demanda.convitesEnviados
          ? demanda.convitesEnviados
          : 0,
        total: demanda.totalConvites ? demanda.totalConvites : 0,
        enviados: convites.length ? convites.length : 0,
        enviando: demanda.enviandoConvites ? demanda.enviandoConvites : false,
      },
      lembretes: {
        jaEnviados: demanda.totalEnvioLembretes
          ? demanda.totalEnvioLembretes
          : 0,
        enviados: lembretes.length ? lembretes.length : 0,
        maxEnvio: MAX_ENVIO_LEMBRETES,
        enviando: demanda.enviandoLembretes ? demanda.enviandoLembretes : false,
        total: demanda.totalConvites,
      },
    };
    response.ok(statusNotificacoes);
  }

  async saveResponseDraft({ request, response, session }) {
    let { respostas, idRascunho, idDemanda, hashLista } = request.allParams();
    let rascunho;

    const schema = {
      idDemanda: "required|string",
      respostas: "object",
    };

    const validation = await validate(
      {
        idDemanda,
        respostas,
      },
      schema
    );

    if (validation.fails()) {
      throw new exception(
        "Função salvar rascunho não recebeu todos os parâmetros obrigatórios",
        400
      );
    }

    //tudo ok, continuando...
    let dadosUsuario = session.get("currentUserAccount");

    //verifica se ja existe um rascunho salvo para esta demanda.
    if (hashLista) {
      rascunho = await respostasRascunhoModel.findOne({
        idDemanda,
        identificador: hashLista,
      });
    } else {
      rascunho = await respostasRascunhoModel.findOne({
        idDemanda,
        matriculaAutor: dadosUsuario.chave,
      });
    }

    //dependendo da ordem do salvamento, uma requisicao pode ter sido enviada sem que a
    //primeira tenha retornado, fazendo com que sejam salvos mais de um rascunho.
    if (rascunho) {
      idRascunho = rascunho.id;
    }

    //Caso seja um novo rascunho
    if (!idRascunho) {
      //incluindo novo rascunho
      const rascunho = new respostasRascunhoModel({
        dataSalvamento: moment().toDate(),
        idDemanda,
        respostas,
        matriculaAutor: dadosUsuario.chave,
        prefixoAutor: dadosUsuario.prefixoAutor,
        identificador: hashLista || "",
        dadosAutor: dadosUsuario,
      });

      //incluindo novo registro de respostas
      await rascunho.save();

      if (rascunho.isNew) {
        throw new exception("Erro ao salvar rascunho no banco de dados.", 500);
      }

      idRascunho = rascunho.id;
      return response.ok({
        idRascunho,
        dataSalvamento: rascunho.dataSalvamento,
      });
    } else {
      //atualizando rascunho anterior
      const updateData = {
        dataSalvamento: moment().toDate(),
        respostas,
      };

      //atualizando o registro de respostas
      rascunho = await respostasRascunhoModel.findByIdAndUpdate(
        idRascunho,
        updateData
      );
      return response.ok({
        idRascunho,
        dataSalvamento: updateData.dataSalvamento,
      });
    }
  }

  async findPerguntasResponder({ request, response, session }) {
    const { idDemanda } = request.allParams();
    const schema = {
      idDemanda: "required|string",
    };

    const validation = await validate(
      {
        idDemanda,
      },
      schema
    );

    if (validation.fails()) {
      throw new exception("Id da demanda não foi informado", 400);
    }

    //funci eh publico-alvo da demanda
    const demanda = await demandasModel.findById(idDemanda);
    let dadosUsuario = session.get("currentUserAccount");
    let matricula = dadosUsuario.chave;
    let prefixo = dadosUsuario.prefixo;

    //verifica se utilizou o modulo lista e filtra os registros
    if (!demanda) {
      throw new exception("Demanda não encontrada!", 500);
    }

    let { tipoPublico } = demanda.publicoAlvo;

    if (tipoPublico === TIPOS_PUBLICOS.LISTA) {
      let { lista } = demanda.publicoAlvo;
      let dadosFiltrados = [];

      for (const registro of lista.dados) {
        if (
          registro[0].trim() === matricula ||
          registro[0].trim() === prefixo
        ) {
          //IMPORTANTE: verifica se o registro ja foi respondido
          let jaRespondida = await respostasModel
            .find({ idDemanda, identificador: registro.hash })
            .countDocuments();
          jaRespondida = jaRespondida ? "Sim" : "Não";

          dadosFiltrados.push({
            ...registro,
            ocorrenciaRespondida: jaRespondida,
          });
        }
      }

      demanda.publicoAlvo.lista.dados = dadosFiltrados;
    }

    // A feature de respostaUnica foi incluída quando o sistema já estava rodando
    // Assim, caso não haja a chave de respostaUnica, deve-se considerar que é uma única resposta
    if (demanda.publicoAlvo.respostaUnica === undefined) {
      demanda.publicoAlvo.respostaUnica = true;
    }

    return response.ok(demanda);
  }

  async removeOccurrence({ request, response, session }) {
    const { idDemanda, hashLista } = request.allParams();
    let dadosUsuario = session.get("currentUserAccount");

    if (!idDemanda) {
      throw new exception("Id da demanda não informado!", 400);
    }

    if (!hashLista) {
      throw new exception("Identificador da ocorrência não informado!", 400);
    }

    //O has do mongo deve ter, no máximo, 24 caracteres
    if (!idDemanda.match(/^[0-9a-fA-F]{24}$/)) {
      throw new exception("Formato do id inválido", 400);
    }

    //remove a resposta da ocorrencis selecionada
    await respostasModel.remove({
      idDemanda,
      identificador: hashLista,
    });

    let demanda = await demandasModel.findById(idDemanda).lean();
    let { dados } = demanda.publicoAlvo.lista;

    let chaveFinalizada = "";

    for (const registro of dados) {
      if (
        registro[0].trim() === dadosUsuario.chave ||
        registro[0].trim() === dadosUsuario.prefixo
      ) {
        if (registro[0].trim() === dadosUsuario.chave) {
          chaveFinalizada = dadosUsuario.chave;
        }

        if (registro[0].trim() === dadosUsuario.prefixo) {
          chaveFinalizada = dadosUsuario.prefixo;
        }

        break;
      }
    }

    //removendo da lista de ocorrencias finalizadas
    let arrayFinalizadas = demanda.publicoAlvo.lista.finalizadas;
    arrayFinalizadas = arrayFinalizadas.filter(
      (elem) => elem !== chaveFinalizada
    );

    const updateData = {
      ...demanda.publicoAlvo,
      lista: { ...demanda.publicoAlvo.lista, finalizadas: arrayFinalizadas },
    };

    //Atualiza a lista de finalizados sem a chave do identificador removido das
    //respostas
    await demandasModel.findByIdAndUpdate(idDemanda, {
      publicoAlvo: updateData,
    });

    return response.ok();
  }

  async removeResponse({ request, response, session }) {
    const allParams = request.allParams();
    let dadosUsuario = session.get("currentUserAccount");
    const idDemanda = allParams.idDemanda;

    if (!idDemanda) {
      throw new exception("Id da demanda não informado!", 400);
    }

    //O has do mongo deve ter, no máximo, 24 caracteres
    if (!idDemanda.match(/^[0-9a-fA-F]{24}$/)) {
      throw new exception("Formato do id inválido", 400);
    }

    if (allParams.excluirTodas) {
      const res = await respostasModel.deleteMany({ idDemanda });

      if (res.deletedCount) {
        await historicoNotificacoesModel.create({
          dataRegistro: moment().toDate(),
          tipoEnvio: TIPOS_NOTIFICACAO.EXCLUSAO_TODAS_RESPOSTAS,
          dadosResponsavel: {
            matricula: dadosUsuario.chave,
            nome: dadosUsuario.nome_usuario,
            nome_guerra: dadosUsuario.nome_guerra,
            prefixo: dadosUsuario.prefixo,
            nomePrefixo: dadosUsuario.dependencia,
          },
          idDemanda,
        });

        //verifica se possui modulo lista, se tiver, exclui todas as finalizadas
        let demanda = await this._getDadosBasicosDemanda(idDemanda);

        if (demanda.publicoAlvo.tipoPublico === TIPOS_PUBLICOS.LISTA) {
          demanda = await demandasModel.findById(idDemanda).lean();

          const updateData = {
            ...demanda.publicoAlvo,
            lista: { ...demanda.publicoAlvo.lista, finalizadas: [] },
          };

          await demandasModel.findByIdAndUpdate(idDemanda, {
            publicoAlvo: updateData,
          });
        }

        return response.ok();
      } else {
        throw new exception(
          "Erro ao remover todas as respostas desta demanda!",
          400
        );
      }
    } else {
      const idResposta = allParams.idResposta;

      if (!idResposta) {
        throw new exception("Id da resposta não informado!", 400);
      }

      //verifica o tipo de publico da demanda
      let demanda = await this._getDadosBasicosDemanda(idDemanda);

      if (demanda.publicoAlvo.tipoPublico === TIPOS_PUBLICOS.LISTA) {
        //obtem a lista de identificadores e remove todos das respostas
        let demanda = await demandasModel.findById(idDemanda).lean();
        const resumoDados = this._getResumoRegistrosLista(
          demanda.publicoAlvo.lista
        );
        let idsList = resumoDados[idResposta].dados.map((elem) => elem.hash);

        await respostasModel.remove({
          idDemanda,
          identificador: { $in: idsList },
        });

        //removendo da lista de ocorrencias finalizadas
        let arrayFinalizadas = demanda.publicoAlvo.lista.finalizadas;
        arrayFinalizadas = arrayFinalizadas.filter(
          (elem) => elem !== idResposta
        );

        const updateData = {
          ...demanda.publicoAlvo,
          lista: {
            ...demanda.publicoAlvo.lista,
            finalizadas: arrayFinalizadas,
          },
        };

        //inclui o identificador na lista de finalizados da lista
        await demandasModel.findByIdAndUpdate(idDemanda, {
          publicoAlvo: updateData,
        });
      } else {
        //O hash do mongo deve ter, no máximo, 24 caracteres
        if (!idResposta.match(/^[0-9a-fA-F]{24}$/)) {
          throw new exception("Formato do id da resposta inválido", 400);
        }

        //removendo uma resposta especifica
        await respostasModel.findByIdAndDelete(idResposta);
      }

      await historicoNotificacoesModel.create({
        dataRegistro: moment().toDate(),
        tipoEnvio: TIPOS_NOTIFICACAO.EXCLUSAO_RESPOSTA,
        dadosResponsavel: {
          matricula: dadosUsuario.chave,
          nome: dadosUsuario.nome_usuario,
          nome_guerra: dadosUsuario.nome_guerra,
          prefixo: dadosUsuario.prefixo,
          nomePrefixo: dadosUsuario.dependencia,
        },
        idDemanda,
      });

      return response.ok();
    }
  }

  /**
   * Faz o download da lista de publico alvo pendentes ou respondidos da demanda.
   *
   * request.allParams = idDemanda : id da demanda
   *                     type: "respondidos" | "pendentes"
   * @param {*} param0
   */

  async getPublicoAlvoCsv({ request, response }) {
    const allParams = request.allParams();
    allParams.getAllRecords = true;

    const demanda = await this._getDadosBasicosDemanda(allParams.idDemanda);
    let publicoAlvo = [];
    let tipoPublico = demanda.publicoAlvo.tipoPublico;

    if (tipoPublico === TIPOS_PUBLICOS.PUBLICOS) {
      publicoAlvo = await this._processaPublicoAlvo(allParams);
    }

    if (tipoPublico === TIPOS_PUBLICOS.LISTA) {
      publicoAlvo = await this._processaPublicoAlvoComLista(allParams);
    }

    let registros = publicoAlvo.results;

    if (registros && registros.length) {
      const headers = [
        { key: "diretoria", header: "Diretoria" },
        { key: "super", header: "Super" },
        { key: "gerev", header: "Gerev" },
        { key: "prefixo", header: "Prefixo" },
        { key: "nomePrefixo", header: "Dependência" },
      ];

      if (tipoPublico !== TIPOS_PUBLICOS.LISTA) {
        headers.push(
          { key: "matricula", header: "Matrícula" },
          { key: "nome", header: "Nome" }
        );
      }

      if (!_.isEmpty(registros[0].desc_cargo)) {
        headers.push({ key: "desc_cargo", header: "Cargo" });
      }

      if (registros[0]["respondidoEm"]) {
        headers.push({ key: "respondidoEm", header: "Respondido em" });

        registros = registros.map((elem) => {
          return {
            ...elem,
            respondidoEm: moment(elem.respondidoEm).format("DD/MM/YYYY HH:mm"),
          };
        });
      }

      if (registros[0]["progressoRespostas"]) {
        headers.push({ key: "progressoRespostas", header: "Progresso" });
      }

      let arquivoExportado = await jsonExport.convert({
        dadosJson: registros,
        headers,
        type: "xls",
        headerTitle: demanda.geral.titulo,
      });

      await jsonExport.download(response, arquivoExportado);
      return;
    }

    return response.badRequest("Nenhum registro encontrado.");
  }

  /**
   *
   *   Método responsável por retornar os públicos alvos respondidos e pendentes com paginação no servidor.
   */

  async findPublicoAlvoPaginate({ request, response, session }) {
    let allParams = request.allParams();
    const demanda = await this._getDadosBasicosDemanda(allParams.idDemanda);
    let resultPublico = {};

    if (demanda.publicoAlvo.tipoPublico === TIPOS_PUBLICOS.PUBLICOS) {
      resultPublico = await this._processaPublicoAlvo(allParams);
    }

    if (demanda.publicoAlvo.tipoPublico === TIPOS_PUBLICOS.LISTA) {
      resultPublico = await this._processaPublicoAlvoComLista(allParams);
    }

    return response.ok(resultPublico);
  }

  /**
   * Metodo utilitario que obtem o publico alvo pendente ou respondidos de uma demanda
   * que utilizou o modulo lista.
   * Pode buscar todos de uma vez, ou realizar a paginacao server side.
   * @param {*} allParams
   */
  async _processaPublicoAlvoComLista(allParams) {
    let mapParamToField = [
      {
        input: "diretoria",
        mongodb: "dadosAutor.pref_diretoria",
        mysql: "mst606.cd_diretor_juris",
      },
      {
        input: "gerev",
        mongodb: "dadosAutor.pref_regional",
        mysql: "mst606.cd_gerev_juris",
      },
      {
        input: "prefixo",
        mongodb: "dadosAutor.prefixo",
        mysql: "mst606.prefixo",
      },
      {
        input: "nomePrefixo",
        mongodb: "dadosAutor.dependencia",
        mysql: "mst606.nome",
      },
      {
        input: "super",
        mongodb: "dadosAutor.pref_super",
        mysql: "mst606.cd_super_juris",
      },
      {
        input: "matricula",
        mongodb: "dadosAutor.chave",
        mysql: "arhfot01.matricula",
      },
      {
        input: "nome",
        mongodb: "dadosAutor.nome_usuario",
        mysql: "arhfot01.nome",
      },
      {
        input: "desc_cargo",
        mongodb: "dadosAutor.nome_funcao",
        mysql: "arhfot01.desc_cargo",
      },
    ];

    let { idDemanda, type, pageSize, page, sortField, sortOrder } = allParams;

    const demanda = await demandasModel.findById(idDemanda).lean();
    let finalizadas = [];

    if (demanda.publicoAlvo.lista.finalizadas) {
      finalizadas = [...demanda.publicoAlvo.lista.finalizadas];
    }

    //criando a estrutura de resumo das ocorrencias da lista
    const resumoDados = this._getResumoRegistrosLista(
      demanda.publicoAlvo.lista
    );
    let publicoFinal = [];
    let multiplaPorPrefixo = demanda.publicoAlvo.multiplaPorPrefixo === true;
    let query = null;
    let fieldRespEm = "matricula";

    let { prefixos, matriculas } = this._obtemDadosFromLista(
      demanda.publicoAlvo.lista.dados
    );
    let publicos = {
      prefixos,
      matriculas,
    };

    sortField = sortField
      ? sortField
      : multiplaPorPrefixo
      ? "nome"
      : "nomePrefixo";

    if (!sortOrder) {
      sortOrder = "asc";
    } else {
      sortOrder = sortOrder === "ascend" ? "asc" : "desc";
    }

    if (type === "pendentes") {
      if (publicos.matriculas.length) {
        /* Total de pendentes */
        query = funciModel
          .query()
          .table("arhfot01")
          .whereIn("matricula", publicos.matriculas);

        if (finalizadas.length) {
          query.whereNotIn("matricula", finalizadas);
        }

        for (let field of mapParamToField) {
          if (allParams[field.input]) {
            query.where(
              field.mysql,
              "like",
              "%" + allParams[field.input] + "%"
            );
          }
        }

        query
          .select([
            "arhfot01.matricula",
            "arhfot01.nome",
            "arhfot01.desc_cargo",
            "mst606.prefixo",
            "mst606.nome as nomePrefixo",
            "mst606.cd_gerev_juris as gerev",
            "mst606.cd_super_juris as super",
            "mst606.cd_diretor_juris as diretoria",
          ])
          .joinRaw(
            "JOIN mst606 ON arhfot01.ag_localiz = mst606.prefixo AND mst606.cd_subord = '00' "
          );
      }

      if (publicos.prefixos.length) {
        if (sortField && sortField === "nomePrefixo") {
          sortField = "nome";
        }

        fieldRespEm = "prefixo";

        /* Query Principal */
        query = funciModel
          .query()
          .table("mst606")
          .select([
            "mst606.prefixo",
            "mst606.nome as nomePrefixo",
            "mst606.cd_gerev_juris as gerev",
            "mst606.cd_super_juris as super",
            "mst606.cd_diretor_juris as diretoria",
          ])
          .whereRaw("cd_subord = '00'")
          .whereIn("prefixo", publicos.prefixos);

        if (finalizadas.length) {
          query.whereNotIn("prefixo", finalizadas);
        }

        for (let field of mapParamToField) {
          if (allParams[field.input]) {
            query.where(
              field.mysql,
              "like",
              "%" + allParams[field.input] + "%"
            );
          }
        }
      }

      let sortedByProgress = sortField && sortField === "progressoRespostas";

      /* Traz os resultados paginados */
      if (allParams.getAllRecords) {
        publicoFinal = { data: [], total: 0 };
        publicoFinal.data = await query.orderBy(sortField, sortOrder).fetch();
        publicoFinal.data = publicoFinal.data.toJSON();
      } else {
        if (sortedByProgress) {
          publicoFinal = await query.paginate(page, pageSize);
        } else {
          publicoFinal = await query
            .orderBy(sortField, sortOrder)
            .paginate(page, pageSize);
        }

        publicoFinal = publicoFinal.toJSON();
      }

      //obtendo o progresso das respostas
      for (let i = 0; i < publicoFinal.data.length; i++) {
        let key = publicoFinal.data[i][fieldRespEm];
        let idsList = resumoDados[key].dados.map((elem) => elem.hash);

        let qtdRespostas = await respostasModel
          .find({
            idDemanda,
            identificador: { $in: idsList },
          })
          .countDocuments();

        publicoFinal.data[i]["progressoRespostas"] =
          parseInt((qtdRespostas / idsList.length) * 100) + "%";
      }

      if (sortedByProgress) {
        publicoFinal.data.sort((a, b) => {
          let left = parseInt(a.progressoRespostas);
          let right = parseInt(b.progressoRespostas);

          if (sortOrder === "asc") {
            //crescente
            return left - right;
          } else {
            //decrescente
            return right - left;
          }
        });
      }
    } else if (type === "respondidos") {
      //so pode continuar se houverem ocorrencias finalizadas
      if (!finalizadas.length) {
        publicoFinal = [];
      } else {
        //caso informada a lista de matriculas
        if (publicos.matriculas.length) {
          /* Total de pendentes */
          query = funciModel
            .query()
            .table("arhfot01")
            .whereIn("matricula", finalizadas);

          for (let field of mapParamToField) {
            if (allParams[field.input]) {
              query.where(
                field.mysql,
                "like",
                "%" + allParams[field.input] + "%"
              );
            }
          }

          query
            .select([
              "arhfot01.matricula",
              "arhfot01.nome",
              "arhfot01.desc_cargo",
              "mst606.prefixo",
              "mst606.nome as nomePrefixo",
              "mst606.cd_gerev_juris as gerev",
              "mst606.cd_super_juris as super",
              "mst606.cd_diretor_juris as diretoria",
            ])
            .joinRaw(
              "JOIN mst606 ON arhfot01.ag_localiz = mst606.prefixo AND mst606.cd_subord = '00' "
            );
        }

        //caso informada a lista de prefixos
        if (publicos.prefixos.length) {
          if (sortField && sortField === "nomePrefixo") {
            sortField = "nome";
          }

          fieldRespEm = "prefixo";

          /* Query Principal */
          query = funciModel
            .query()
            .table("mst606")
            .select([
              "mst606.prefixo",
              "mst606.nome as nomePrefixo",
              "mst606.cd_gerev_juris as gerev",
              "mst606.cd_super_juris as super",
              "mst606.cd_diretor_juris as diretoria",
            ])
            .whereRaw("cd_subord = '00'")
            .whereIn("prefixo", finalizadas);

          for (let field of mapParamToField) {
            if (allParams[field.input]) {
              query.where(
                field.mysql,
                "like",
                "%" + allParams[field.input] + "%"
              );
            }
          }
        }

        let sortedByResponseDate = sortField && sortField === "respondidoEm";

        /* Traz os resultados paginados */
        if (allParams.getAllRecords) {
          publicoFinal = { data: [], total: 0 };
          publicoFinal.data = await query.orderBy(sortField, sortOrder).fetch();
          publicoFinal.data = publicoFinal.data.toJSON();
        } else {
          if (sortedByResponseDate) {
            publicoFinal = await query.paginate(page, pageSize);
          } else {
            publicoFinal = await query
              .orderBy(sortField, sortOrder)
              .paginate(page, pageSize);
          }

          publicoFinal = publicoFinal.toJSON();
        }

        let tmpPublico = [...publicoFinal.data];
        publicoFinal.data = [];

        //obtendo a data da ultima resposta para criar o campo respondidoEm
        for (let i = 0; i < tmpPublico.length; i++) {
          let key = tmpPublico[i][fieldRespEm];

          if (resumoDados[key]) {
            let idsList = resumoDados[key].dados.map((elem) => elem.hash);

            let ultimaResposta = await respostasModel
              .findOne({
                idDemanda,
                identificador: { $in: idsList },
              })
              .sort({ dataRegistro: "desc" })
              .limit(1)
              .lean();

            if (ultimaResposta) {
              tmpPublico[i]["respondidoEm"] = ultimaResposta.dataRegistro;
              //adiciona no publico final apenas se achou uma resposta no resumoDados
              publicoFinal.data.push({ ...tmpPublico[i] });
            }
          }
        }

        if (sortedByResponseDate) {
          publicoFinal.data.sort((a, b) => {
            if (moment(a.respondidoEm).isAfter(b.respondidoEm))
              return sortOrder === "asc" ? 1 : -1;
            if (moment(a.respondidoEm).isBefore(b.respondidoEm))
              return sortOrder === "asc" ? -1 : 1;
            return 0;
          });
        }
      }
    }

    return {
      results: publicoFinal.data,
      totalCount: publicoFinal.total,
    };
  }

  /**
   * Metodo utilitario que obtem o publico alvo pendente ou respondidos de uma demanda.
   * Pode buscar todos de uma vez, ou realizar a paginacao server side.
   * @param {*} allParams
   */
  async _processaPublicoAlvo(allParams) {
    let mapParamToField = [
      {
        input: "diretoria",
        mongodb: "dadosAutor.pref_diretoria",
        mysql: "mst606.cd_diretor_juris",
      },
      {
        input: "gerev",
        mongodb: "dadosAutor.pref_regional",
        mysql: "mst606.cd_gerev_juris",
      },
      {
        input: "prefixo",
        mongodb: "dadosAutor.prefixo",
        mysql: "mst606.prefixo",
      },
      {
        input: "nomePrefixo",
        mongodb: "dadosAutor.dependencia",
        mysql: "mst606.nome",
      },
      {
        input: "super",
        mongodb: "dadosAutor.pref_super",
        mysql: "mst606.cd_super_juris",
      },
      {
        input: "matricula",
        mongodb: "dadosAutor.chave",
        mysql: "arhfot01.matricula",
      },
      {
        input: "nome",
        mongodb: "dadosAutor.nome_usuario",
        mysql: "arhfot01.nome",
      },
      {
        input: "desc_cargo",
        mongodb: "dadosAutor.nome_funcao",
        mysql: "arhfot01.desc_cargo",
      },
    ];

    let { idDemanda, type, pageSize, page, sortField, sortOrder } = allParams;

    const demanda = await demandasModel.findById(idDemanda);
    let respondentes = null;
    let publicoFinal = null;
    let multiplaPorPrefixo = demanda.publicoAlvo.multiplaPorPrefixo === true;
    let campoFiltro = multiplaPorPrefixo ? "matriculaAutor" : "prefixoAutor";
    let publicos = demanda.publicoAlvo.publicos;

    publicos.prefixos = _.isUndefined(publicos.prefixos)
      ? []
      : publicos.prefixos;
    publicos.matriculas = _.isUndefined(publicos.matriculas)
      ? []
      : publicos.matriculas;

    sortField = sortField
      ? sortField
      : multiplaPorPrefixo
      ? "nome"
      : "nomePrefixo";

    if (!sortOrder) {
      sortOrder = "asc";
    } else {
      sortOrder = sortOrder === "ascend" ? "asc" : "desc";
    }

    if (type === "pendentes") {
      respondentes = await respostasModel
        .find({ idDemanda })
        .select(`${campoFiltro} dataRegistro -_id`)
        .lean();

      //se forem os pendentes, pega o publico total - publico respondente
      if (multiplaPorPrefixo) {
        let arrayRespondentes = respondentes.map((reg) => reg.matriculaAutor);
        /* Total de pendentes */
        let query = funciModel
          .query()
          .table("arhfot01")
          .where(function () {
            this.where(function () {
              // É das agências e não é uma das matrículas avulsas
              this.whereIn("ag_localiz", publicos.prefixos).whereNotIn(
                "matricula",
                publicos.matriculas
              );
            })
              // Ou é uma das matrículas avulsas
              .orWhereIn("matricula", publicos.matriculas);
          })
          // Não é um respondente
          .whereNotIn("matricula", arrayRespondentes);

        //Inclui as pesquisas na query;
        for (let field of mapParamToField) {
          if (allParams[field.input]) {
            query.where(
              field.mysql,
              "like",
              "%" + allParams[field.input] + "%"
            );
          }
        }

        query
          .select([
            "arhfot01.matricula",
            "arhfot01.nome",
            "arhfot01.desc_cargo",
            "mst606.prefixo",
            "mst606.nome as nomePrefixo",
            "mst606.cd_gerev_juris as gerev",
            "mst606.cd_super_juris as super",
            "mst606.cd_diretor_juris as diretoria",
          ])
          .joinRaw(
            "JOIN mst606 ON arhfot01.ag_localiz = mst606.prefixo AND mst606.cd_subord = '00' "
          );

        if (allParams.getAllRecords) {
          publicoFinal = { data: [] };
          publicoFinal.data = await query.orderBy(sortField, sortOrder).fetch();
          publicoFinal.data = publicoFinal.data.toJSON();
        } else {
          publicoFinal = await query
            .orderBy(sortField, sortOrder)
            .paginate(page, pageSize);
          publicoFinal = publicoFinal.toJSON();
        }
      } else {
        //Array de prefixos que já responderam
        let arrayRespondentes = respondentes.map((reg) => reg.prefixoAutor);
        if (sortField && sortField === "nomePrefixo") {
          sortField = "nome";
        }

        /* Query Principal */
        let query = funciModel
          .query()
          .table("mst606")
          .select([
            "mst606.prefixo",
            "mst606.nome as nomePrefixo",
            "mst606.cd_gerev_juris as gerev",
            "mst606.cd_super_juris as super",
            "mst606.cd_diretor_juris as diretoria",
          ])
          .whereRaw("cd_subord = '00'")
          .whereIn("prefixo", publicos.prefixos)
          .whereNotIn("prefixo", arrayRespondentes);

        for (let field of mapParamToField) {
          if (allParams[field.input]) {
            query.where(
              field.mysql,
              "like",
              "%" + allParams[field.input] + "%"
            );
          }
        }

        /* Traz os resultados paginados */

        if (allParams.getAllRecords) {
          publicoFinal = { data: [] };
          publicoFinal.data = await query.orderBy(sortField, sortOrder).fetch();
          publicoFinal.data = publicoFinal.data.toJSON();
        } else {
          publicoFinal = await query
            .orderBy(sortField, sortOrder)
            .paginate(page, pageSize);
          publicoFinal = publicoFinal.toJSON();
        }
      }
    } else if (type === "respondidos") {
      let searchFields = {};
      sortField = this._getSortDBField(sortField);

      /* Constrói a query REGEX do mongoDB */
      for (const field of mapParamToField) {
        if (allParams[field.input]) {
          searchFields[field.mongodb] = {
            $regex: allParams[field.input],
            $options: "i",
          };
        }
      }

      let totalCount = await respostasModel
        .find({ idDemanda, ...searchFields })
        .countDocuments();

      if (allParams.getAllRecords) {
        respondentes = await respostasModel
          .find({ idDemanda, ...searchFields })
          .sort({ [sortField]: sortOrder })
          .lean();
      } else {
        respondentes = await respostasModel
          .find({ idDemanda, ...searchFields })
          .sort({ [sortField]: sortOrder })
          .skip((parseInt(page) - 1) * parseInt(pageSize))
          .limit(parseInt(pageSize))
          .lean();
      }

      publicoFinal = { data: [], total: totalCount };

      publicoFinal.data = respondentes.map((respondente) => {
        return {
          id: respondente._id,
          key: respondente._id,
          diretoria: respondente.dadosAutor.pref_diretoria,
          super: respondente.dadosAutor.pref_super,
          gerev: respondente.dadosAutor.pref_regional,
          prefixo: respondente.dadosAutor.prefixo,
          nomePrefixo: respondente.dadosAutor.dependencia,
          matricula: respondente.dadosAutor.chave,
          nome: respondente.dadosAutor.nome_usuario,
          desc_cargo: respondente.dadosAutor.nome_funcao,
          respondidoEm: respondente.dataRegistro,
        };
      });
    }

    return {
      results: publicoFinal.data,
      totalCount: publicoFinal.total,
    };
  }

  /** === Métodos Privados === */

  /**
   *   Método que recebe um array de identificadores e excluir as respostas e rascunhos correspondentes
   * @param {*} arrayRemovidos
   */

  async _excluirRespRemovidosLista(
    arrayRemovidos,
    idDemanda,
    responsavelExclusao
  ) {
    if (!arrayRemovidos.length) {
      return;
    }

    try {
      const query = {
        idDemanda: new ObjectId(idDemanda),
        identificador: { $in: arrayRemovidos },
      };

      const respostas = await respostasModel.find(query).lean();

      if (respostas.length) {
        const respostasExcluidas = respostas.map((resposta) => {
          delete resposta._id;

          return {
            ...resposta,
            responsavelExclusao: responsavelExclusao,
            dataExclusao: moment(),
          };
        });

        await respostasExcluidasModel.insertMany(respostasExcluidas);

        //Remove as respostas referentes a público alvo excluído
        await respostasModel.remove(query);
        await respostasRascunhoModel.remove(query);
      }
    } catch (error) {
      throw new exception("Erro ao excluir respostas do banco de dados", 500);
    }
  }

  async _excluirRespUnica(idDemanda, responsavelExclusao) {
    try {
      const query = { idDemanda: new ObjectId(idDemanda) };
      const respostas = await respostasModel.find(query).lean();

      const respostasExcluidas = respostas.map((resposta) => {
        delete resposta._id;

        return {
          ...resposta,
          responsavelExclusao: responsavelExclusao,
          dataExclusao: moment(),
        };
      });

      await respostasExcluidasModel.insertMany(respostasExcluidas);

      //Remove as respostas referentes a público alvo excluído
      await respostasModel.remove(query);
      await respostasRascunhoModel.remove(query);
    } catch (error) {
      throw new exception("Erro ao excluir respostas do banco de dados", 500);
    }
  }

  async _excluirRespRemovidosPublicos(removidos, idDemanda) {
    let removeQuery = {
      $and: [
        { idDemanda: new ObjectId(idDemanda) },
        {
          $or: [
            { matriculaAutor: { $in: removidos.matriculas } },
            { prefixoAutor: { $in: removidos.prefixos } },
          ],
        },
      ],
    };

    //Remove as respostas referentes a público alvo excluído
    await respostasModel.remove(removeQuery);
    await respostasRascunhoModel.remove(removeQuery);
  }

  /**
   *
   *  Método responsável por trazer as demandas pendentes de respostas para o tipo Publicos
   *
   * @param {*} dadosUsuario Dados do usuário logado, salvos na sessão
   */
  async _getDemandasPublicos(dadosUsuario) {
    let { prefixo, chave } = dadosUsuario;
    let demandas = await this._getDemandasUsuario({chave, prefixo, removerExpiradas: true});

    //obtendo a lista dos id's da demanda retornadas
    let listaIds = [];

    for (let demanda of demandas) {
      listaIds.push(demanda.id)
    }

    let respondidas = await respostasModel.find({ 
      idDemanda: { $in: listaIds }, 
      $and: [{
        $or: [ {matriculaAutor: chave}, {prefixoAutor: prefixo} ]
      }]
    }, { respostas: false}).lean();

    let demandasFiltradas = [];

    for (let demanda of demandas) {
      let found = false;

      for (let resposta of respondidas) {
        let idDemanda = demanda.id.toString();
        let idDemResposta = resposta.idDemanda.toString();

        if (idDemanda === idDemResposta) {
          if (demanda.publicoAlvo.multiplaPorPrefixo === false ||
             (demanda.publicoAlvo.multiplaPorPrefixo === true &&
              resposta.matriculaAutor === chave)) {
              found = true;
          }
        }
      }

      if (!found) {
        demandasFiltradas.push(demanda);
      }
    }

    return demandasFiltradas;
  }

  /**
   *
   *  Método responsável por trazer as demandas pendentes de respostas para o tipo Listas
   *
   * @param {*} dadosUsuario Dados do usuário logado, salvos na sessão
   */

  async _getDemandasLista(dadosUsuario) {
    let { prefixo, chave } = dadosUsuario;

    //Pipeline de filtros
    const demandas = await demandasModel.aggregate([      
      {
        $project: {
          __v: false,
          colaboradores: false,          
          notificacoes: false,
          perguntas: false,
          totalConvites: false,
          totalLembretes: false,
          totalEnvioLembretes: false,
          enviandoConvites: false,
          enviandoLembretes: false,
          convitesEnviados: false,
        }
      },
      {
        $match: {
          "geral.dataExpiracao": { $gte: new Date() }, //Filtra as demandas já expiradas
          "publicoAlvo.tipoPublico": "lista", // Filtra as demandas cujo tipo não seja "lista"
          "geral.status": STATUS_DEMANDA.PUBLICADA, // Filtra somente as publicadas
          $and: [
            {
              $or: [
                { "publicoAlvo.lista.dados": { $elemMatch: { 0: prefixo } } },
                { "publicoAlvo.lista.dados": { $elemMatch: { 0: chave } } },
              ],
            },
            {
              "publicoAlvo.lista.finalizados": {
                $not: { $in: [prefixo, chave] },
              },
            },
          ],
        },
      },
      {
        $addFields: {
          id: "$_id",
          dataExpiracao: {
            $convert: {
              input: "$geral.dataExpiracao",
              to: "date",
            },
          },
          titulo: "$geral.titulo",
        },
      },
      {
        $project: {
          geral: false,
          publicoAlvo: false,
        }
      },
    ]);

    return demandas;
  }

  async _getPublicoAlvo(demanda) {
    switch (demanda.publicoAlvo.tipoPublico) {
      case TIPOS_PUBLICOS.PUBLICOS:
        return this._getPublicoAlvoDefault(demanda);
      case TIPOS_PUBLICOS.LISTA:
        return this._getPublicoAlvoLista(demanda);
    }

    return {
      listaDestinatarios: [],
      listaPrefixosDestin: [],
    };
  }

  /**
   * Obtem a lista de prefixos/matriculas distintos no array dos dados.
   * Tipo de público: Lista - dados localizado em publicoAlvo->lista->dados
   * @param {*} dados
   */
  _obtemDadosFromLista(dados) {
    const tmpMatriculas = [];
    const tmpPrefixos = [];

    //obtem a lista unica de prefixos e matriculas
    for (let registro of dados) {
      let item = registro["0"];

      if (item.length <= 4) {
        if (!tmpPrefixos.includes(item)) {
          tmpPrefixos.push(item);
        }
      } else {
        if (!tmpMatriculas.includes(item)) {
          tmpMatriculas.push(item);
        }
      }
    }

    return {
      prefixos: tmpPrefixos,
      matriculas: tmpMatriculas,
    };
  }

  async _getPublicoAlvoLista(demanda) {
    let listaDestinatarios = [];
    let listaPrefixosDestin = [];
    let { dados } = demanda.publicoAlvo.lista;

    let { prefixos, matriculas } = this._obtemDadosFromLista(dados);

    if (matriculas.length) {
      const resultFuncis = await funciModel
        .query()
        .select("*")
        .table("arhfot01")
        .with("dependencia", (builder) => {
          builder.where("cd_subord", "00");
        })
        .whereIn("matricula", matriculas)
        .with("nomeGuerra")
        .fetch();

      if (resultFuncis) {
        listaDestinatarios = resultFuncis.toJSON();
      }
    }

    if (prefixos.length) {
      listaPrefixosDestin = await getManyDependencias(prefixos);
    }

    return {
      listaDestinatarios,
      listaPrefixosDestin,
    };
  }

  async _getPublicoAlvoDefault(demanda) {
    let listaDestinatarios = [];
    let listaPrefixosDestin = [];
    let publicos = demanda.publicoAlvo.publicos;

    if (demanda.publicoAlvo.multiplaPorPrefixo === true) {
      const resultFuncis = await funciModel
        .query()
        .select("*")
        .table("arhfot01")
        .with("dependencia", (builder) => {
          builder.where("cd_subord", "00");
        })
        .whereIn("ag_localiz", demanda.publicoAlvo.publicos.prefixos)
        .orWhereIn("matricula", demanda.publicoAlvo.publicos.matriculas)
        .with("nomeGuerra")
        .fetch();

      if (resultFuncis) {
        listaDestinatarios = resultFuncis.toJSON();
      }
    } else {
      //obtem a lista dos funcis pelas matriculas
      if (!_.isEmpty(publicos.matriculas)) {
        const funcis = await getManyFuncis(publicos.matriculas);
        if (funcis) {
          listaDestinatarios = funcis;
        }
      }

      //obtem a lista dos funcis pelos prefixos
      if (!_.isEmpty(publicos.prefixos)) {
        const dependencias = await getManyDependencias(publicos.prefixos);
        if (dependencias) {
          listaPrefixosDestin = dependencias.map((dependencia) => {
            return {
              ...dependencia,
              uor: parseInt(dependencia.uor),
            };
          });
        }
      }
    }

    return {
      listaDestinatarios,
      listaPrefixosDestin,
    };
  }

  _getSortDBField(input) {
    switch (input) {
      case "diretoria":
        return "dadosAutor.pref_diretoria";
      case "super":
        return "dadosAutor.pref_super";
      case "prefixo":
        return "prefixoAutor";
      case "gerev":
        return "dadosAutor.pref_regional";
      case "nomePrefixo":
        return "dadosAutor.dependencia";
      case "matricula":
        return "dadosAutor.chave";
      case "nome":
        return "dadosAutor.nome_usuario";
      case "desc_cargo":
        return "dadosAutor.nome_funcao";
      case "respondidoEm":
        return "dataRegistro";
      default:
        return "dadosAutor.nome_usuario";
    }
  }

  _getResumoRegistrosLista(lista) {
    const { dados, headers } = lista;
    let resumoDados = {};

    for (const elem of dados) {
      let key = String(elem[0]).toUpperCase();

      if (!resumoDados[key]) {
        resumoDados[key] = {};
      }

      if (!resumoDados[key]["headers"]) {
        resumoDados[key]["headers"] = [...headers];
      }

      if (resumoDados[key]["dados"]) {
        resumoDados[key]["dados"].push(elem);
      } else {
        resumoDados[key]["dados"] = [elem];
      }
    }

    return resumoDados;
  }
}

module.exports = DemandaController;
