"use strict";

const { Command } = require("@adonisjs/ace");
const { count } = require("console");
const Database = use("Database");
const ordemModel = use("App/Models/Mysql/OrdemServ/Ordem");
const emailsRotinaNoturnaModel = use(
  "App/Models/Mysql/OrdemServ/EmailsRotinaNoturna"
);
const participanteExpandidoModel = use(
  "App/Models/Mysql/OrdemServ/ParticipanteExpandido"
);
const registrarHistorico = use("App/Commons/OrdemServ/registrarHistorico");
const naoPassivelAssinatura = use(
  "App/Commons/OrdemServ/naoPassivelAssinatura"
);
const moment = use("App/Commons/MomentZoneBR");
const { OrdemServConsts } = use("Constants");
const {
  ESTADOS,
  EVENTOS_HISTORICO,
  TIPO_VINCULO,
  TIPO_PARTICIPACAO,
  DEFAULT_REMETENTE_EMAILS,
  TIPO_NOTIFICACAO,
} = OrdemServConsts;
const {
  getComposicaoComite,
  getOneFunci,
  getFuncisByPrefixo,
  getFuncisByNomeCargo,
} = use("App/Commons/Arh");
const { incluirParticipateExpandido, getMatriculasDesignantes } = use(
  "App/Commons/OrdemServ/expandirParticipantes"
);
const { findINCText } = use("App/Commons/BaseIncUtils");
const { getOneDependencia } = use("App/Commons/Arh");
const Logger = use("Logger");
const _ = require("lodash");
const generateTemplateAgrupado = use("App/Templates/OrdemServ/EmailAgrupado");
const { sendMail } = use("App/Commons/SendMail");
const notificacaoModel = use("App/Models/Mysql/OrdemServ/Notificacao");
const { capitalize } = use("App/Commons/StringUtils");

const DEFAULT_USER = "SISTEMA";

const TAMANHO_BLOCOS_PROCESSAMENTO = 10000;

const dadosSistema = {
  prefixo: "0000",
  chave: "*",
  nome_usuario: DEFAULT_USER,
};

const TIPO_EMAIL = {
  CIENCIA: "Solicitação de Ciência",
  ASSINATURA: "Solicitação de Assinatura",
  REVOGACAO: "Revogação de Participação",
  VIGENCIA_TEMPORARIA: "Em Vigência Temporária",
};

/**
 * Escreve uma mensagem no arquivo de transporte de saida definido.
 *
 * @param {*} message - texto da mensagem
 */
function LogMessage(type = "info", message = "", printSeparator = false) {
  let dataHora = moment().format("HH:mm:ss");

  Logger.transport("osRotinaNoturna").info({
    type,
    timestamp: dataHora,
    message,
  });

  if (printSeparator) {
    Logger.transport("osRotinaNoturna").info({
      type,
      timestamp: dataHora,
      message:
        "=============================================================================",
    });
  }
}

function LogMessageParallel(message) {
  let dataHora = moment().format("HH:mm:ss");

  Logger.transport("osRotinaNoturaParallel").info({
    timestamp: dataHora,
    message,
  });
}

async function inserirDadosEmailFila({
  matricula,
  tipoEmail,
  idOrdem,
  numero,
  titulo,
  responsavel,
  acao,
  motivo,
  informacao,
}) {
  const registroFila = new emailsRotinaNoturnaModel();

  registroFila.matricula = matricula;
  registroFila.tipo_email = tipoEmail;
  registroFila.id_ordem = idOrdem;
  registroFila.numero = numero;
  registroFila.titulo = titulo;
  registroFila.responsavel = responsavel;
  registroFila.acao = acao;
  registroFila.motivo = motivo;
  registroFila.informacao = informacao;

  try {
    await registroFila.save();
  } catch (err) {
    LogMessage(
      "error",
      `Falha ao inserir o registro de email na fila. Matricula: ${matricula} - idOrdem: ${idOrdem}`
    );
  }
}

/**
 * Metodo que realiza a revogacao de uma ordem de servico.
 */
async function revogarOrdem(id, motivoRevogacao, tipoEvento) {
  try {
    //altera o status da ordem para REVOGADA
    let ordem = await ordemModel.findBy("id", id);
    ordem.id_estado = ESTADOS.REVOGADA;
    ordem.data_vig_ou_revog = moment();
    ordem.data_limite_vig_temp = null;
    await ordem.save();

    //grava o registro de revogacao da ordem no historico
    await registrarHistorico({
      idOrdem: id,
      idEvento: EVENTOS_HISTORICO.REVOGOU_ORDEM,
      tipoParticipacao: DEFAULT_USER,
      dadosParticipante: { ...dadosSistema },
      respAlteracao: DEFAULT_USER,
    });

    //criando registro de revogacao para todos os participantes
    let listaParticipantes = await participanteExpandidoModel
      .query()
      .with("participanteEdicao")
      .with("dadosFunci")
      .whereHas("participanteEdicao.ordem", (builder) => {
        builder.where("id", id);
      })
      .fetch();

    listaParticipantes = listaParticipantes.toJSON();

    for (const participante of listaParticipantes) {
      let dadosParticipante = {
        prefixo: participante.prefixo,
        chave: participante.matricula,
        nome_usuario: participante.nome || "",
        uor: participante.uor_participante,
        nome_funcao: participante.dadosFunci
          ? participante.dadosFunci.desc_cargo
          : "INF. NAO ENCONTRADA",
      };

      //grava o registro de remocao do participante por alteracao da ordem
      await registrarHistorico({
        idOrdem: id,
        idEvento: tipoEvento,
        tipoParticipacao: participante.participanteEdicao.tipo_participacao,
        dadosParticipante,
        respAlteracao: DEFAULT_USER,
      });

      //NOTIFICA VIA E-mail a saida da ordem de servico por revogacao da ordem
      let responsavelAlteracao = DEFAULT_USER;

      inserirDadosEmailFila({
        matricula: participante.matricula,
        tipoEmail: TIPO_EMAIL.REVOGACAO,
        idOrdem: id,
        numero: ordem.numero,
        titulo: ordem.titulo,
        responsavel: responsavelAlteracao,
        acao: `Você foi removido(a) de ${participante.participanteEdicao.tipo_participacao} da Ordem de Serviço`,
        motivo: motivoRevogacao,
        informacao:
          "Você pode visualizar todas as ordens de que participa {LINK_MINHAS_ORDENS}",
      });

      //Obs: Nao deve remover o participante da tabela.
      //Este deve aparecer ainda na visualizacao da ordem.
      //A remocao so e realizada na edicao de um ordem vigente.
    }

    //informa aos colaboradores que a ordem foi revogada
    const colaboradores = await ordem.colaboradores().fetch();

    for (const colab of colaboradores.rows) {
      inserirDadosEmailFila({
        matricula: colab.matricula,
        tipoEmail: TIPO_EMAIL.REVOGACAO,
        idOrdem: ordem.id,
        numero: ordem.numero,
        titulo: ordem.titulo,
        responsavel: DEFAULT_USER,
        acao: "A Ordem de Servi&ccedil;o foi revogada.",
        motivo: motivoRevogacao,
        informacao:
          "Você pode visualizar todas as ordens de que participa {LINK_MINHAS_ORDENS}",
      });
    }
  } catch (err) {
    //continue
  }
}

/**
 * Metodo utilitario que verifica a situacao do funci e se o mesmo esta impedido de assinar/dar ciencia
 * na ordem de servico.
 * Caso esteja passivel e marcado como nao passivel, envia o email solicitando assinatura e remove o flag da tabela.
 * @param {*} participanteEdicao
 */
async function verificaPassividadeAssinatura(partExpandido, codSituacaoFunci) {
  const participanteEdicao = await partExpandido.participanteEdicao().fetch();

  if (partExpandido.assinou) {
    //verifica se esta nao passivel de assinatura, apenas troca o flag
    if (partExpandido.nao_passivel_assinatura === 1) {
      partExpandido.nao_passivel_assinatura = 0;
      await partExpandido.save();
    }
  } else {
    //nao assinou - verifica se esta nao passivel de assinatura
    let assinaturaNaoPossivel = await naoPassivelAssinatura(
      codSituacaoFunci,
      partExpandido.matricula
    );

    //altera o flag para passivel
    partExpandido.nao_passivel_assinatura = assinaturaNaoPossivel;
    await partExpandido.save();

    //se nao assinou ou se voltou a estar passivel de assinatura, notifica solicitando assinatura.
    if (assinaturaNaoPossivel === 0) {
      const ordem = await participanteEdicao.ordem().fetch();

      const dadosComuns = {
        matricula: partExpandido.matricula,
        idOrdem: ordem.id,
        numero: ordem.numero,
        titulo: ordem.titulo,
        responsavel: DEFAULT_USER,
        acao: `Você foi incluído(a) como <strong>${participanteEdicao.tipo_participacao}</strong> na Ordem de Serviço`,
        motivo: "",
      };

      //notifica solicitando assinatura
      if (
        participanteEdicao.tipo_participacao === TIPO_PARTICIPACAO.DESIGNANTE
      ) {
        //insere registro na fila de e-mails
        inserirDadosEmailFila({
          ...dadosComuns,
          tipoEmail: TIPO_EMAIL.ASSINATURA,
          informacao:
            "Verifique os dados completos desta O.S e realize a assinatura desta ordem {LINK_ORDEM_ASSINAR}",
        });
      } else {
        //insere registro na fila de e-mails
        inserirDadosEmailFila({
          ...dadosComuns,
          tipoEmail: TIPO_EMAIL.CIENCIA,
          informacao:
            "Verifique os dados completos desta O.S e realize a ciência desta ordem {LINK_ORDEM_CIENCIA}",
        });
      }
    }
  }
}

/**
 * Metodo utilitario que realiza a revogacao e notificacao de um participante de uma ordem de servico
 * por mudanca de prefixo.
 * @param {*} partExpandido
 */
async function revogaParticipanteDaOrdem(
  partExpandido,
  motivoRevogacao = null,
  forceDelete = false
) {
  LogMessage(
    "warn",
    `Revogando participante da ordem. Partic.: ${partExpandido.matricula}-${partExpandido.nome} - prefixo: ${partExpandido.prefixo}`
  );

  const participanteEdicao = await partExpandido.participanteEdicao().fetch();

  let dadosParticipante = {
    prefixo: partExpandido.prefixo,
    chave: partExpandido.matricula,
    nome_usuario: partExpandido.nome,
    uor: partExpandido.uor_participante,
    nome_funcao: partExpandido.dadosFunci
      ? partExpandido.dadosFunci.desc_cargo
      : "INF. NAO ENCONTRADA",
  };

  //grava o registro de remocao do participante
  await registrarHistorico({
    idOrdem: participanteEdicao.id_ordem,
    idEvento: motivoRevogacao
      ? EVENTOS_HISTORICO.REMOVIDO_POR_ALTERACAO_ORDEM
      : EVENTOS_HISTORICO.SAIU_ORDEM_POR_MUD_PREF,
    tipoParticipacao: participanteEdicao.tipo_participacao,
    dadosParticipante,
    respAlteracao: DEFAULT_USER,
  });

  const ordem = await participanteEdicao.ordem().fetch();

  //isere o registro na fila de e-mails
  inserirDadosEmailFila({
    matricula: partExpandido.matricula,
    tipoEmail: TIPO_EMAIL.REVOGACAO,
    idOrdem: ordem.id,
    numero: ordem.numero,
    titulo: ordem.titulo,
    responsavel: DEFAULT_USER,
    acao: `Você foi removido(a) de ${participanteEdicao.tipo_participacao} da Ordem de Serviço`,
    motivo:
      motivoRevogacao ||
      "Você não pertence mais ao quadro da dependência definida nesta ordem.",
    informacao:
      "Você pode visualizar todas as ordens de que participa {LINK_MINHAS_ORDENS}",
  });

  if (
    participanteEdicao.id_tipo_vinculo === TIPO_VINCULO.MATRICULA_INDIVIDUAL
  ) {
    //se for matricula individual marca como inativo na tabela de edicao
    participanteEdicao.ativo = 0;
    await participanteEdicao.save();
  }

  if (
    forceDelete ||
    participanteEdicao.tipo_participacao === TIPO_PARTICIPACAO.DESIGNADO
  ) {
    //remove o participante da tabela no caso de designados ou passado o flag forceDelete.
    await participanteExpandidoModel
      .query()
      .where("id", partExpandido.id)
      .delete();

    if (
      participanteEdicao.id_tipo_vinculo === TIPO_VINCULO.MATRICULA_INDIVIDUAL
    ) {
      //se excluiu o participante deste tipo, remove-o da lista de vinculos da tabela de edicao
      LogMessage(
        "warn",
        `Removendo o vinculo da tabela de edição para participante: ${partExpandido.matricula}-${partExpandido.nome}`
      );
      await participanteEdicao.query().delete();
    }
  }

  LogMessage("success", "Revogação do participante concluída com sucesso!");
}

/**
 * Inclui um novo participante na tabela de participante expandido e notifica solicitando a assinatura.
 * @param {*} participanteEdicao - objeto do participanteEdicao.
 * @param {*} matricula
 * @param {*} cod_tipo_votacao
 */
async function novoParticipateExpandido(
  participanteEdicao,
  matricula,
  cod_tipo_votacao = 0
) {
  //tenta incluir na tabela
  LogMessage(
    "info",
    `Incluindo novo participante. Matricula: ${matricula} - Prefixo: ${participanteEdicao.prefixo} - Ordem: ${participanteEdicao.id_ordem}`
  );

  const novoPartic = await incluirParticipateExpandido(
    participanteEdicao.id,
    matricula,
    cod_tipo_votacao
  );

  if (novoPartic) {
    LogMessage("success", "Inclusão realizada com sucesso!");

    if (novoPartic.nao_passivel_assinatura === 0) {
      const ordem = await participanteEdicao.ordem().fetch();

      const dadosComuns = {
        matricula: matricula,
        idOrdem: ordem.id,
        numero: ordem.numero,
        titulo: ordem.titulo,
        responsavel: DEFAULT_USER,
        acao: `Você foi incluído(a) como <strong>${participanteEdicao.tipo_participacao}</strong> na Ordem de Serviço`,
        motivo: "",
      };

      //se a inclusao ocorreu sem errors, notifica por e-mail
      if (
        participanteEdicao.tipo_participacao === TIPO_PARTICIPACAO.DESIGNANTE
      ) {
        //insere registro na fila de e-mails
        inserirDadosEmailFila({
          ...dadosComuns,
          tipoEmail: TIPO_EMAIL.ASSINATURA,
          informacao:
            "Verifique os dados completos desta O.S e realize a assinatura desta ordem {LINK_ORDEM_ASSINAR}",
        });
      } else {
        //insere registro na fila de e-mails
        inserirDadosEmailFila({
          ...dadosComuns,
          tipoEmail: TIPO_EMAIL.CIENCIA,
          informacao:
            "Verifique os dados completos desta O.S e realize a ciência desta ordem {LINK_ORDEM_CIENCIA}",
        });
      }
    }
  } else {
    LogMessage("error", "Falha ao incluir o novo participante!");
  }
}

/**
 * Metodo generico utilizado para validar um participante expandido ja cadastrado.
 * @param {*} partExpandido
 */
async function validarParticipanteExpandido(partExpandido) {
  let dadosFunci = await getOneFunci(partExpandido.matricula);

  //verifica se mudou de prefixo ou se não foi encontrado na fot01
  if (
    !dadosFunci ||
    (dadosFunci.prefixoLotacao !== partExpandido.prefixo &&
      dadosFunci.agenciaLocalizacao !== partExpandido.prefixo)
  ) {
    //grava a revogacao do participante
    await revogaParticipanteDaOrdem(partExpandido);
  } else {
    //nao mudou de prefixo, verifica a situacao de trabalho do mesmo
    await verificaPassividadeAssinatura(partExpandido, dadosFunci.codSituacao);
  }
}
/**
 * Metodo que realiza a validacao de uma participante do tipo Matricula Individual.
 * @param {*} participanteEdicao
 */
async function validarMatriculaIndividual(participanteEdicao) {
  let listaPartExpand = await participanteEdicao
    .participanteExpandido()
    .fetch();
  let partExpandido = listaPartExpand.rows[0];

  if (!partExpandido) {
    let ordem = await ordemModel.find(participanteEdicao.id_ordem);

    if (ordem.id_estado !== ESTADOS.PENDENTE_ASSINATURA_DESIGNANTES) {
      LogMessage(
        "error",
        `Não encontrado o participante exp. com id de edição: [${participanteEdicao.id}] e ordem nro: [${participanteEdicao.id_ordem}]. Expandir por aqui?`
      );
    }

    return;
  }

  try {
    //valida os dados do participante
    await validarParticipanteExpandido(partExpandido);
  } catch (err) {
    LogMessage(
      "error",
      `Erro ao validarMatriculaIndividual! id de edição: [${participanteEdicao.id}] e ordem nro: [${participanteEdicao.id_ordem}]`
    );
  }
}

/**
 * Metodo que faz a validacao de todos os participantes do comitê.
 * @param {*} participanteEdicao
 */
async function validarComite(participanteEdicao) {
  //apenas verifica a validade de comitês ainda nao resolvidos
  //comitês que ja atingiram o quorum e foram resolvidos nao podem mais ser alterados.
  if (!participanteEdicao.resolvido) {
    let listaPartExpandidos = await participanteEdicao
      .participanteExpandido()
      .fetch();

    if (!listaPartExpandidos.rows.length) {
      let ordem = await ordemModel.find(participanteEdicao.id_ordem);

      if (ordem.id_estado !== ESTADOS.PENDENTE_ASSINATURA_DESIGNANTES) {
        LogMessage(
          "error",
          `Nenhum participante expandido encontrado para o comitê: [${participanteEdicao.codigo_comite}], prefixo: [${participanteEdicao.prefixo}] e com id de edição: [${participanteEdicao.id}] e ordem nro: [${participanteEdicao.id_ordem}]. Expandir por aqui?`
        );
      }

      return;
    }

    //obtem os membros atuais do comitê
    let membrosComite = await getComposicaoComite(
      participanteEdicao.prefixo,
      participanteEdicao.codigo_comite
    );

    if (!membrosComite || !membrosComite.length) {
      LogMessage(
        "error",
        `Nenhum membro do comitê encontrado com id de edição: [${participanteEdicao.id}] e ordem nro: [${participanteEdicao.id_ordem}].`
      );
      //array vazio para seguir o processamento
      membrosComite = [];
    } else {
      membrosComite = membrosComite.map((elem) => {
        return {
          matricula: elem.CD_FUN,
          cod_tipo_votacao: elem.CD_TIP_VOT,
        };
      });
    }

    //obtem os a lista de participantes cadastrado neste vinculo
    let participantes = listaPartExpandidos.rows.map((elem) => {
      return {
        id: elem.id,
        matricula: elem.matricula,
      };
    });

    let listaNovos = _.differenceBy(membrosComite, participantes, "matricula");
    let listaRemovidos = _.differenceBy(
      participantes,
      membrosComite,
      "matricula"
    );
    let listaAtualizar = _.differenceBy(
      participantes,
      listaRemovidos,
      "matricula"
    );

    //processa os membros que sairam da ordem
    for (const partRemover of listaRemovidos) {
      try {
        let partExpandido = await participanteExpandidoModel.findBy(
          "id",
          partRemover.id
        );
        //grava a revogacao do participante
        await revogaParticipanteDaOrdem(
          partExpandido,
          "Você não faz mais parte do comitê definido nesta ordem.",
          true
        );
      } catch (err) {
        LogMessage(
          "error",
          `Erro ao remover participante do Comite! id de edição: [${participanteEdicao.id}] e ordem nro: [${participanteEdicao.id_ordem}]`
        );
      }
    }

    //processa os novos membros
    for (const novoPart of listaNovos) {
      try {
        //inclui o novo membro na tabela de participante expandido e o notifica via e-mail solicitando assinatura
        await novoParticipateExpandido(
          participanteEdicao,
          novoPart.matricula,
          novoPart.cod_tipo_votacao
        );
      } catch (err) {
        LogMessage(
          "error",
          `Erro ao incluir novo participante do Comite! Matricula: ${novoPart.matricula} - id de edição: [${participanteEdicao.id}] e ordem nro: [${participanteEdicao.id_ordem}]`
        );
      }
    }

    //processa os membros que permaneceram na ordem
    for (const partAtualizar of listaAtualizar) {
      try {
        let partExpandido = await participanteExpandidoModel.findBy(
          "id",
          partAtualizar.id
        );
        //valida os dados do participante
        await validarParticipanteExpandido(partExpandido);
      } catch (err) {
        LogMessage(
          "error",
          `Erro ao atualizar participante Comite! id de edição: [${participanteEdicao.id}] e ordem nro: [${participanteEdicao.id_ordem}]`
        );
      }
    }
  }
}

/**
 * Método que faz a validação de todos os participantes do prefixo.
 */
async function validarPrefixo(participanteEdicao) {
  let listaPartExpandidos = await participanteEdicao
    .participanteExpandido()
    .fetch();

  if (!listaPartExpandidos.rows.length) {
    let ordem = await ordemModel.find(participanteEdicao.id_ordem);

    if (ordem.id_estado !== ESTADOS.PENDENTE_ASSINATURA_DESIGNANTES) {
      LogMessage(
        "error",
        `ValidarPrefixo - Nenhum participante expandido encontrado para o prefixo: [${participanteEdicao.prefixo}] e com id de edição: [${participanteEdicao.id}] e ordem nro: [${participanteEdicao.id_ordem}] e estado diferente de Pendente de Assinatura dos Designantes. Expandir por aqui?`
      );
    }

    return;
  }

  //obtem os funcis do prefixo definido no vinculo
  let listaFuncisPrefixoCompleta = await getFuncisByPrefixo(
    participanteEdicao.prefixo,
    true
  );
  let listaFuncisPrefixo = [];

  //a lista de funcis do prefixo se refere a validacao exclusiva de designados.
  //neste caso, devem ser excluidos os funcis que estiverem no papel de designantes.
  let listaDesignantesOrdem = await getMatriculasDesignantes(
    participanteEdicao.id_ordem
  );

  for (let funcionario of listaFuncisPrefixoCompleta) {
    for (let matriculaDesignante of listaDesignantesOrdem) {
      if (funcionario.matricula !== matriculaDesignante) {
        //não eh designante, adiciona o funci da lista dos prefixos
        listaFuncisPrefixo.push(funcionario);
      }
    }
  }

  if (!listaFuncisPrefixo || !listaFuncisPrefixo.length) {
    LogMessage(
      "error",
      `ValidarPrefixo - Nenhum funci encontrado no prefixo: [${participanteEdicao.prefixo}] e com id de edição: [${participanteEdicao.id}] e ordem nro: [${participanteEdicao.id_ordem}].`
    );
    return;
  }

  //obtem os a lista de participantes cadastrado neste vinculo
  let participantes = listaPartExpandidos.rows.map((elem) => {
    return {
      id: elem.id,
      matricula: elem.matricula,
    };
  });

  let listaNovos = _.differenceBy(
    listaFuncisPrefixo,
    participantes,
    "matricula"
  );
  let listaRemovidos = _.differenceBy(
    participantes,
    listaFuncisPrefixo,
    "matricula"
  );
  let listaAtualizar = _.differenceBy(
    participantes,
    listaRemovidos,
    "matricula"
  );

  //processa os participantes que sairam da ordem
  for (const partRemover of listaRemovidos) {
    try {
      let partExpandido = await participanteExpandidoModel.findBy(
        "id",
        partRemover.id
      );
      //grava a revogacao do participante
      await revogaParticipanteDaOrdem(partExpandido);
    } catch (err) {
      LogMessage(
        "error",
        `Erro ao remover participante do prefixo! id de edição: [${participanteEdicao.id}] e ordem nro: [${participanteEdicao.id_ordem}]`
      );
    }
  }

  //processa os novos participantes
  for (const novoPart of listaNovos) {
    try {
      //inclui o novo membro na tabela de participante expandido e o notifica via e-mail solicitando assinatura
      await novoParticipateExpandido(participanteEdicao, novoPart.matricula);
    } catch (err) {
      LogMessage(
        "error",
        `Erro ao incluir novo participante do prefixo! Matricula: ${novoPart.matricula} - id de edição: [${participanteEdicao.id}] e ordem nro: [${participanteEdicao.id_ordem}]`
      );
    }
  }

  //processa os participantes que permaneceram na ordem
  for (const partAtualizar of listaAtualizar) {
    try {
      let partExpandido = await participanteExpandidoModel.findBy(
        "id",
        partAtualizar.id
      );
      //valida os dados do participante
      await validarParticipanteExpandido(partExpandido);
    } catch (err) {
      LogMessage(
        "error",
        `Erro ao atualizar participante do prefixo! id de edição: [${participanteEdicao.id}] e ordem nro: [${participanteEdicao.id_ordem}]`
      );
    }
  }

  if (
    (listaNovos.length || listaRemovidos.length) &&
    participanteEdicao.resolvido
  ) {
    //se entraram ou sairam participantes, marca o vinculo como NAO resolvido
    participanteEdicao.resolvido = 0;
    await participanteEdicao.save();
  } else if (
    listaAtualizar.length === participantes.length &&
    participanteEdicao.resolvido === 0
  ) {
    //marca o vinculo como resolvido.
    participanteEdicao.resolvido = 1;
    await participanteEdicao.save();
  }
}

/**
 * Método que faz a validação de todos os participantes do prefixo.
 */
async function validarFuncoesPrefixo(participanteEdicao) {
  let listaPartExpandidos = await participanteEdicao
    .participanteExpandido()
    .fetch();

  if (!listaPartExpandidos.rows.length) {
    let ordem = await ordemModel.find(participanteEdicao.id_ordem);

    if (ordem.id_estado !== ESTADOS.PENDENTE_ASSINATURA_DESIGNANTES) {
      LogMessage(
        "error",
        `ValidarFuncoesPrefixo - Nenhum participante expandido encontrado para a funcao: ${participanteEdicao.cargo_comissao} e o prefixo: [${participanteEdicao.prefixo}] e com id de edição: [${participanteEdicao.id}] e ordem nro: [${participanteEdicao.id_ordem}] e estado diferente de Pendente de Assinatura dos Designantes. Expandir por aqui?`
      );
    }

    return;
  }

  //importante verifica se a diretoria do prefixo eh a UOP
  //se for busca pelo prefixo_lotacao
  const PREFIXO_DIOPE = "9600";

  let prefixoAtual = participanteEdicao.prefixo;
  let dadosDependencia = await getOneDependencia(prefixoAtual);
  let buscarPrefLotacao = false;

  if (
    prefixoAtual !== PREFIXO_DIOPE &&
    dadosDependencia.diretoria === PREFIXO_DIOPE
  ) {
    //eh uma dep. de PSO ou centros.
    buscarPrefLotacao = true;
  }

  //obtem os funcis do prefixo e funcao definidos no vinculo
  let listaFuncisPrefixoCompleta = await getFuncisByNomeCargo(
    prefixoAtual,
    [participanteEdicao.cargo_comissao],
    buscarPrefLotacao
  );
  let listaFuncisPrefixo = [];

  //a lista de funcis do prefixo por cargo se refere a validacao exclusiva de designados.
  //neste caso, devem ser excluidos os funcis que estiverem no papel de designantes.
  let listaDesignantesOrdem = await getMatriculasDesignantes(
    participanteEdicao.id_ordem
  );

  for (let funcionario of listaFuncisPrefixoCompleta) {
    for (let matriculaDesignante of listaDesignantesOrdem) {
      if (funcionario.matricula !== matriculaDesignante) {
        //não eh designante, adiciona o funci da lista dos prefixos
        listaFuncisPrefixo.push(funcionario);
      }
    }
  }

  if (!listaFuncisPrefixo || !listaFuncisPrefixo.length) {
    LogMessage(
      "error",
      `ValidarFuncoesPrefixo - Nenhum funci encontrado no prefixo: [${participanteEdicao.prefixo}], função: ${participanteEdicao.cargo_comissao} e com id de edição: [${participanteEdicao.id}] e ordem nro: [${participanteEdicao.id_ordem}].`
    );
    return;
  }

  //obtem os a lista de participantes cadastrado neste vinculo
  let participantes = listaPartExpandidos.rows.map((elem) => {
    return {
      id: elem.id,
      matricula: elem.matricula,
    };
  });

  let listaNovos = _.differenceBy(
    listaFuncisPrefixo,
    participantes,
    "matricula"
  );
  let listaRemovidos = _.differenceBy(
    participantes,
    listaFuncisPrefixo,
    "matricula"
  );
  let listaAtualizar = _.differenceBy(
    participantes,
    listaRemovidos,
    "matricula"
  );

  //processa os participantes que sairam da ordem
  for (const partRemover of listaRemovidos) {
    try {
      let partExpandido = await participanteExpandidoModel.findBy(
        "id",
        partRemover.id
      );
      //grava a revogacao do participante
      await revogaParticipanteDaOrdem(partExpandido);
    } catch (err) {
      LogMessage(
        "error",
        `Erro ao remover participante do prefixo! id de edição: [${participanteEdicao.id}] e ordem nro: [${participanteEdicao.id_ordem}]`
      );
    }
  }

  //processa os novos participantes
  for (const novoPart of listaNovos) {
    try {
      //inclui o novo membro na tabela de participante expandido e o notifica via e-mail solicitando assinatura
      await novoParticipateExpandido(participanteEdicao, novoPart.matricula);
    } catch (err) {
      LogMessage(
        "error",
        `Erro ao incluir novo participante do prefixo! Matricula: ${novoPart.matricula} - id de edição: [${participanteEdicao.id}] e ordem nro: [${participanteEdicao.id_ordem}]`
      );
    }
  }

  //processa os participantes que permaneceram na ordem
  for (const partAtualizar of listaAtualizar) {
    try {
      let partExpandido = await participanteExpandidoModel.findBy(
        "id",
        partAtualizar.id
      );
      //valida os dados do participante
      await validarParticipanteExpandido(partExpandido);
    } catch (err) {
      LogMessage(
        "error",
        `Erro ao atualizar participante do prefixo! id de edição: [${participanteEdicao.id}] e ordem nro: [${participanteEdicao.id_ordem}]`
      );
    }
  }

  if (
    (listaNovos.length || listaRemovidos.length) &&
    participanteEdicao.resolvido
  ) {
    //se entraram ou sairam participantes, marca o vinculo como NAO resolvido
    participanteEdicao.resolvido = 0;
    await participanteEdicao.save();
  } else if (
    listaAtualizar.length === participantes.length &&
    participanteEdicao.resolvido === 0
  ) {
    //marca o vinculo como resolvido.
    participanteEdicao.resolvido = 1;
    await participanteEdicao.save();
  }
}

/**
 * Metodo principal que faz a validação de todos os vinculos de uma ordem de serviço.
 * @param {*} ordem - objeto da ordem de servico a ser analisada/validada.
 */
async function validarParticipantesOrdem(ordem) {
  //obtem a lista de participantesEdicao
  let listaParticEdicao = await ordem
    .participantesEdicao()
    .with("participanteExpandido", (builder) => {
      builder.with("participanteEdicao").with("dadosFunci");
    })
    .where("ativo", 1)
    .orderBy("tipo_participacao", "desc")
    .fetch();

  for (const partEdicao of listaParticEdicao.rows) {
    switch (partEdicao.id_tipo_vinculo) {
      case TIPO_VINCULO.MATRICULA_INDIVIDUAL: {
        LogMessage(
          "info",
          `Validando vinculo de matrícula individual: ${partEdicao.matricula}`
        );
        await validarMatriculaIndividual(partEdicao);
        LogMessage(
          "info",
          `Fim da validacao do vinculo de matrícula individual: ${partEdicao.matricula}`
        );
        break;
      }

      case TIPO_VINCULO.COMITE: {
        LogMessage(
          "info",
          `Validando vinculo de comitê: ${partEdicao.codigo_comite} - ${partEdicao.nome_comite}`
        );
        await validarComite(partEdicao);
        LogMessage(
          "info",
          `Fim da validacao do vinculo de comitê: ${partEdicao.codigo_comite} - ${partEdicao.nome_comite}`
        );
        break;
      }

      case TIPO_VINCULO.PREFIXO: {
        LogMessage(
          "info",
          `Validando vinculo de prefixo: ${partEdicao.prefixo}`
        );
        await validarPrefixo(partEdicao);
        LogMessage(
          "info",
          `Fim da validacao do vinculo de prefixo: ${partEdicao.prefixo}`
        );
        break;
      }

      case TIPO_VINCULO.CARGO_COMISSAO: {
        LogMessage(
          "info",
          `Validando vinculo de cargo/funcao: ${partEdicao.prefixo} - ${partEdicao.cargo_comissao}`
        );
        await validarFuncoesPrefixo(partEdicao);
        LogMessage(
          "info",
          `Fim da validacao do vinculo de cargo/funcao: ${partEdicao.prefixo} - ${partEdicao.cargo_comissao}`
        );
        break;
      }
    }
  }
}

async function verificaVinculosAtivosDesignantes(ordem) {
  const listaParticEdicao = await ordem
    .participantesEdicao()
    .where("ativo", 1)
    .where("tipo_participacao", TIPO_PARTICIPACAO.DESIGNANTE)
    .fetch();

  if (listaParticEdicao.rows.length === 0) {
    //nenhum designante ativo na ordem, muda para VIGENCIA PROVISORIA
    let dataFinalVigencia = moment().add(30, "day");
    let dataFinalVigFmt = dataFinalVigencia.format("DD/MM/YYYY");

    ordem.id_estado = ESTADOS.VIGENTE_PROVISORIA;
    ordem.data_limite_vig_temp = dataFinalVigencia;
    ordem.save();

    LogMessage(
      "warn",
      "Notificando os colaboradores sobre a Vigência temporária da Ordem."
    );

    const motivoRevogacao = `Nenhum Designante ativo encontrado nesta ordem. A ordem será automáticamente regovada em: ${dataFinalVigFmt}.`;
    await notificaColaboradoresSobreVigenciaTemp(ordem, motivoRevogacao);

    LogMessage("warn", `Motivo Revogação: ${motivoRevogacao}`);
    LogMessage("warn", "Fim da notificação dos colaboradores da ordem.");
  }
}

async function verificaValidadeInstrucoesNormativas(ordem) {
  if (
    ![ESTADOS.VIGENTE, ESTADOS.PENDENTE_ASSINATURA_DESIGNANTES].includes(
      ordem.id_estado
    )
  ) {
    //estado nao permite validacao de instrucoes normativas
    LogMessage(
      "error",
      `Estado atual da ordem não permite validação das instruções normativas. Ordem: [${ordem.id}] - idEstado: [${ordem.id_estado}].`
    );
    return;
  }

  let listaInstrucoes = await ordem.instrucoesNormativas().fetch();
  let mudarParaVigenteTemporaria = false;
  let deveRevogarOrdem = false;
  let incRemovidas = [];

  for (let instrucao of listaInstrucoes.rows) {
    const {
      numero: nroINC,
      cod_tipo_normativo: codTipoNormativo,
      item: baseItem,
      versao,
      texto_item: textoItem,
    } = instrucao;
    let dadosINCAtual = await findINCText({
      nroINC,
      codTipoNormativo,
      baseItem,
    });

    if (!dadosINCAtual) {
      //dados da IN nao encontrados na base
      instrucao.texto_item_alterado = "Instrução Removida da Base.";
      instrucao.nova_versao = versao;
      instrucao.contem_original = 0;
      instrucao.sofreu_alteracao = 0;
      await instrucao.save();

      LogMessage(
        "info",
        `Instrução removida da base da INC. Ordem será revogada pelo sistema. Ordem: [${ordem.id}] - nroINC: [${nroINC}] - tipoNorm: [${codTipoNormativo}] - item: [${baseItem}] - versao: [${versao}].`
      );
      incRemovidas.push(nroINC);
      deveRevogarOrdem = true;
    } else if (dadosINCAtual.NR_VRS_CTU_ASNT !== versao) {
      //mudou a versao da in verficacao
      if (dadosINCAtual.TX_PRGF_CTU === textoItem) {
        //o texto continua igual, apenas evolui a versao
        LogMessage(
          "info",
          `Texto atual igual ao texto da INC atual. Atualizando a versão do item. ordem: [${ordem.id}] - nroINC: [${nroINC}] - tipoNorm: [${codTipoNormativo}] - item: [${baseItem}] - versao: [${versao}] - novaVersao: [${dadosINCAtual.NR_VRS_CTU_ASNT}].`
        );
        instrucao.versao = dadosINCAtual.NR_VRS_CTU_ASNT;
        instrucao.contem_original = 0;
        instrucao.sofreu_alteracao = 0;
        await instrucao.save();
      } else {
        LogMessage(
          "info",
          `Mudando a ordem para vigente temporária devido a alterações nas intruções normativas. ordem: [${ordem.id}] - nroINC: [${nroINC}] - tipoNorm: [${codTipoNormativo}] - item: [${baseItem}] - versao: [${versao}] - novaVersao: [${dadosINCAtual.NR_VRS_CTU_ASNT}].`
        );

        //versao e texto diferentes...
        instrucao.texto_item_alterado = dadosINCAtual.TX_PRGF_CTU;
        instrucao.nova_versao = dadosINCAtual.NR_VRS_CTU_ASNT;
        instrucao.sofreu_alteracao = 1;
        instrucao.contem_original = 0;
        await instrucao.save();

        mudarParaVigenteTemporaria = true;
        LogMessage(
          "info",
          `Fim da alteração na ordem por mudança de IN's. ordem: [${ordem.id}] - nroINC: [${nroINC}] - tipoNorm: [${codTipoNormativo}] - item: [${baseItem}] - versao: [${versao}] - novaVersao: [${dadosINCAtual.NR_VRS_CTU_ASNT}].`
        );
      }
    } else {
      //versao igual a atual, faz uma verificacao se o texto do item da base exportada contem o texto original
      if (
        dadosINCAtual.TX_PRGF_CTU !== textoItem &&
        dadosINCAtual.TX_PRGF_CTU.includes(textoItem)
      ) {
        //contem o texto base no novo texto, atualiza apenas o texto. Houve truncamento na hora de salvar.
        //problema já resolvido, apenas corrigindo as ordens antigas.
        LogMessage(
          "info",
          `Versões iguais com textos diferentes. Texto atual contido no texto da INC atual, atualiza o texto do item de acordo com o texto vindo da consulta a INC. Ordem: [${ordem.id}] - nroINC: [${nroINC}] - tipoNorm: [${codTipoNormativo}] - item: [${baseItem}] - versao: [${versao}].`
        );
        instrucao.contem_original = 1;
        instrucao.texto_item_alterado = dadosINCAtual.TX_PRGF_CTU;
        instrucao.nova_versao = dadosINCAtual.NR_VRS_CTU_ASNT;
        instrucao.texto_item = dadosINCAtual.TX_PRGF_CTU;
        await instrucao.save();
      }
    }
  }

  if (deveRevogarOrdem) {
    const motivoRevogacao = `Ordem revogada por alteração nas instruções normativas. Item(s) contido(s) nesta ordem foram removidos da INC. IN - [${incRemovidas.join(
      ","
    )}].`;
    await revogarOrdem(
      ordem.id,
      motivoRevogacao,
      EVENTOS_HISTORICO.REMOVIDO_POR_ALTERACAO_NA_INC
    );
    LogMessage("info", `Motivo da Revogação: ${motivoRevogacao}`);
  } else if (mudarParaVigenteTemporaria) {
    //texto completamente diferente, altera a ordem para vigente provisoria e notifica os envolvidos
    await alteraOrdemVigenciaTemporaria(ordem);

    //notificando os designantes e colaboradores
    const motivoAlteracao =
      "Houve alteração no texto das instruções contidas na ordem. Acesse o menu Minhas Ordens -> Ações -> Ver Ins. Norm. Alteradas para validar as alterações ou revogar a ordem. A vigência deste ordem é de 30 dias a partir desta data.";
    await notificaDesignantesSobreVigenciaTemp(ordem, motivoAlteracao);
    await notificaColaboradoresSobreVigenciaTemp(ordem, motivoAlteracao);
    LogMessage("info", `Motivo da Revogação: ${motivoAlteracao}`);
  }
}

async function alteraOrdemVigenciaTemporaria(ordem) {
  let dataFinalVigencia = moment().add(30, "day");
  ordem.id_estado = ESTADOS.VIGENTE_PROVISORIA;
  ordem.data_limite_vig_temp = dataFinalVigencia;
  await ordem.save();
}

async function notificaColaboradoresSobreVigenciaTemp(ordem, motivoRevogacao) {
  //obtem a lista de colaboradores para notificar
  const colaboradores = await ordem.colaboradores().fetch();

  for (const colab of colaboradores.rows) {
    inserirDadosEmailFila({
      matricula: colab.matricula,
      tipoEmail: TIPO_EMAIL.VIGENCIA_TEMPORARIA,
      idOrdem: ordem.id,
      numero: ordem.numero,
      titulo: ordem.titulo,
      responsavel: DEFAULT_USER,
      acao: "A Ordem de Servi&ccedil;o abaixo foi alterada para o estado de <strong>Vig&ecirc;ncia Tempor&aacute;ria.</strong>",
      motivo: motivoRevogacao,
      informacao:
        "Você pode visualizar todas as ordens de que participa {LINK_MINHAS_ORDENS}",
    });
  }
}

async function notificaDesignantesSobreVigenciaTemp(ordem, motivoRevogacao) {
  let listaParticipantes = await participanteExpandidoModel
    .query()
    .with("participanteEdicao")
    .with("dadosFunci")
    .whereHas("participanteEdicao", (builder) => {
      builder
        .where("id_ordem", ordem.id)
        .where("tipo_participacao", TIPO_PARTICIPACAO.DESIGNANTE);
    })
    .fetch();

  for (const participante of listaParticipantes.rows) {
    inserirDadosEmailFila({
      matricula: participante.matricula,
      tipoEmail: TIPO_EMAIL.VIGENCIA_TEMPORARIA,
      idOrdem: ordem.id,
      numero: ordem.numero,
      titulo: ordem.titulo,
      responsavel: DEFAULT_USER,
      acao: "A Ordem de Servi&ccedil;o abaixo foi alterada para o estado de <strong>Vig&ecirc;ncia Tempor&aacute;ria.</strong>",
      motivo: motivoRevogacao,
      informacao:
        "Você pode visualizar todas as ordens de que participa {LINK_MINHAS_ORDENS}",
    });
  }
}

async function verificarOrdens() {
  /**@type any[] */
  const ordens = await ordemModel
    .query()
    .with("estado")
    .with("dadosAutor")
    .with("instrucoesNormativas")
    .whereHas("estado", (builder) => {
      builder.whereIn("id", [
        ESTADOS.VIGENTE,
        ESTADOS.VIGENTE_PROVISORIA,
        ESTADOS.PENDENTE_ASSINATURA_DESIGNANTES,
      ]);
    })
    .orderBy("id")
    .fetch();

  if (ordens) {
    let totalOrdens = ordens.rows.length;
    const blocosProcessamento = [];
    for (let i = 0; i < totalOrdens; i += TAMANHO_BLOCOS_PROCESSAMENTO) {
      /** Caso o segundo parâmetro do slice for maior que o array, ele retorna o último */
      const bloco = ordens.rows.slice(i, i + TAMANHO_BLOCOS_PROCESSAMENTO);
      blocosProcessamento.push(bloco);
    }

    LogMessage("info", `Examinando: ${totalOrdens} ordens.`, true);
    LogMessage("info", "Limpando a tabela da fila de e-mails...");
    await emailsRotinaNoturnaModel.query().truncate();
    LogMessage("info", "Limpeza da tabela de fila finalizada.");

    const resultadosProcessamentos = await Promise.all(
      blocosProcessamento.map(async (bloco, index) => {
        let countProcessada = 0;
        for (const ordem of bloco) {
          LogMessageParallel(
            `Processando ordem ${countProcessada} / ${bloco.length} do bloco ${index}`
          );
          countProcessada++;

          let id = ordem.id;

          let hoje = moment();
          let dataFmt,
            dataValidade = null;

          //verifica se a ordem deve ser revogada por decaimento de prazo de vigencia temporaria
          if (ordem.id_estado === ESTADOS.VIGENTE_PROVISORIA) {
            //se estiver neste estado verifica a data_limite_vig_temp
            dataValidade = ordem.data_limite_vig_temp;
          } else if (ordem.tipo_validade === "Determinada") {
            dataValidade = ordem.data_validade;
          }

          if (dataValidade) {
            dataFmt = moment(dataValidade).format("DD/MM/YYYY");
            dataValidade = moment(dataValidade).add(1, "day");

            if (dataValidade < hoje) {
              //faz a revogacao da ordem
              LogMessage(
                "info",
                `Revogando a ordem id: [${id}] e data de validade: [${dataFmt}].`
              );
              let motivoRevogacao = `Ordem revogada por fim do prazo da vigência. Data validade: ${dataFmt}`;
              await revogarOrdem(
                id,
                motivoRevogacao,
                EVENTOS_HISTORICO.REMOVIDO_POR_FINAL_VIGENCIA
              );
              LogMessage(
                "info",
                `Fim da revogação da ordem id: [${id}].`,
                true
              );

              //passa para a proxima ordem da lista
              continue;
            }
          }

          if (ordem.id_estado === ESTADOS.VIGENTE_PROVISORIA) {
            LogMessage(
              "info",
              `Ordem em vigência provisória. Fim da validação. Ordem id: [${id}].`
            );
            continue;
          }

          //se a ordem nao foi revogada, inicia a validacao dos participantes
          LogMessage(
            "info",
            `Iniciando a validação dos participantes da ordem id: [${id}].`
          );
          await validarParticipantesOrdem(ordem);
          LogMessage(
            "info",
            `Fim da validação dos participantes da ordem id: [${id}].`
          );

          //verifica se sobraram vinculos ativos de designantes na ordem
          LogMessage(
            "info",
            `Iniciando verificação de designantes ativos na ordem id: [${id}].`
          );
          await verificaVinculosAtivosDesignantes(ordem);
          LogMessage(
            "info",
            `Fim da verificação de designantes ativos na ordem id: [${id}].`,
            true
          );

          LogMessage(
            "info",
            `Iniciando verificação de alterações nas intruções normativas. ordem: [${id}].`
          );
          await verificaValidadeInstrucoesNormativas(ordem);
          LogMessage(
            "info",
            `Fim da verificação nas intruções normativas. ordem id: [${id}].`,
            true
          );
        }
      })
    );
  }
}

async function enviarEmailsAgrupados() {
  //obtem a lista unica de matriculas
  const funcisAgrupados = await emailsRotinaNoturnaModel
    .query()
    .setVisible("matricula")
    .groupBy("matricula")
    .fetch();

  LogMessage(
    "info",
    "Início da lista de matrículas",
    true
  );
  LogMessage(
    "info",
    (funcisAgrupados.toJSON()).map((item) => item.matricula).toString()
  );
  LogMessage(
    "info",
    "Fim da lista de matrículas",
    true
  );

  LogMessage(
    "info",
    "Início do envio dos emails",
    true
  );

  for (let funci of funcisAgrupados.rows) {
    const dadosFunci = await getOneFunci(funci.matricula);

    if (dadosFunci) {
      //obtem os registro agrupados por tipo do funci atual
      const registrosAgrupados = await emailsRotinaNoturnaModel
        .query()
        .where("matricula", funci.matricula)
        .groupBy("tipo_email")
        .fetch();

      let ocorrencias = [];

      for (let registro of registrosAgrupados.rows) {
        //obtem todas as ocorrencias individuais para montar o email
        //personalizado
        let registrosIndividuais = await emailsRotinaNoturnaModel
          .query()
          .where("matricula", registro.matricula)
          .where("tipo_email", registro.tipo_email)
          .fetch();

        registrosIndividuais = registrosIndividuais.toJSON();

        if (registrosIndividuais.length) {
          let nomeSecao = registrosIndividuais[0].tipo_email;
          ocorrencias.push({ nomeSecao, registros: registrosIndividuais });
        }
      }

      //envia o email agrupado
      let mensagemEmail = generateTemplateAgrupado({
        nomeGuerra: capitalize(dadosFunci.nomeGuerra),
        ocorrencias,
      });

      sendMail({
        from: DEFAULT_REMETENTE_EMAILS,
        to: dadosFunci.email.toLowerCase(),
        subject: "Ordem de Serviço - Resumo das Ações Pendentes",
        body: mensagemEmail,
      })
        .then((enviouEmail) => {
          const enviadoComSucesso = enviouEmail ? "Sucesso" : "Falha";

          LogMessage(
            "info",
            `Email agrupado enviado com ${String(enviadoComSucesso).toUpperCase()} para o funci: ${dadosFunci.matricula} - ${dadosFunci.nome} (${dadosFunci.email.toLowerCase()})`
          );

          if (enviouEmail) {
            //registra a notificacao de envio
            let notificacao = new notificacaoModel();
            notificacao.id_ordem = 1;
            notificacao.id_tipo_notificacao = TIPO_NOTIFICACAO.DIVERSAS;
            notificacao.prefixo_participante = dadosFunci.agenciaLocalizacao;
            notificacao.matricula_participante = dadosFunci.matricula;
            notificacao.nome_participante = dadosFunci.nome;
            notificacao.email_destinatario = dadosFunci.email;
            notificacao.resultado_envio = enviadoComSucesso;

            //inclui a notificacao de envio
            notificacao.save();
          }
        });
    }
  }

  LogMessage(
    "success",
    "Fim do Envio de emails agrupados",
    true
  );
}

class RotinaVerificacaoNoturna extends Command {
  static get signature() {
    return "ordemserv:rotinaVerificacaoNoturna";
  }

  static get description() {
    return "Executa as rotinas automatizadas de verificação dos estados das Ordens de Serviço. Revoga ordens, Exclui/Inclui participantes, etc.";
  }

  async handle(args, options) {
    LogMessage("info", "Iniciando as verficações das ordens...", true);

    await verificarOrdens();
    await enviarEmailsAgrupados();

    LogMessage("success", "Completed!", true);

    Database.close();

    // Comentar linha abaixo ao testar o comando
    process.exit();
  }
}

module.exports = RotinaVerificacaoNoturna;
