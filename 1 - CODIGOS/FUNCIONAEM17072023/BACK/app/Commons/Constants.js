/**
 *   Arquivo para concentrar as constantes de todas as ferramentas*
 */

module.exports = {
  /**
   * Constantes definidas no banco de dados para atualizacao/criacao
   * de registros referentes as ordens de servico.
   */
  OrdemServConsts: {
    DEFAULT_REMETENTE_EMAILS: "ordemserv.superadm@bb.com.br",

    ESTADOS: {
      RASCUNHO: 1,
      PENDENTE_ASSINATURA_DESIGNANTES: 2,
      VIGENTE: 3,
      VIGENTE_PROVISORIA: 4,
      REVOGADA: 5,
      EXCLUIDA: 6,
    },

    TIPO_PARTICIPACAO: {
      DESIGNANTE: "Designante",
      DESIGNADO: "Designado",
      COLABORADOR: "Colaborador",
      DEPENDENCIA: "Dependência",
    },

    EVENTOS_HISTORICO: {
      CRIACAO_DA_ORDEM: 1,
      FINALIZOU_RASCUNHO: 2,
      ASSINOU_A_ORDEM: 3,
      CIENCIA_NA_ORDEM: 4,
      SAIU_ORDEM_POR_MUD_PREF: 5,
      REVOGOU_ORDEM: 6,
      EXCLUIU_ORDEM: 7,
      REMOVIDO_POR_ALTERACAO_ORDEM: 8,
      REMOVIDO_POR_REVOGACAO_ORDEM: 9,
      DUPLICOU_ORDEM: 10,
      REMOVIDO_POR_FINAL_VIGENCIA: 11,
      REMOVIDO_POR_ALTERACAO_NA_INC: 12,
      CONFIRMOU_ALTERACAO_DAS_INC: 13,
      VOLTOU_PARA_RASCUNHO: 14,
    },

    TIPO_VINCULO: {
      MATRICULA_INDIVIDUAL: 1,
      PREFIXO: 2,
      CARGO_COMISSAO: 3,
      COMITE: 4,
    },

    TIPO_VOTACAO_COMITE: {
      TITULAR: 5,
      SUBSTITUTO: 4,
      NORMAL: 3,
    },

    TIPO_NOTIFICACAO: {
      SOLICITACAO_ASSINATURA: 1,
      SOLICITACAO_CIENCIA: 2,
      REVOGACAO_ORDEM: 3,
      DIVERSAS: 4,
    },
  },

  // Nome do Schema do Postgres
  mtnConsts: {
    pgSchema: "novo_mtn", // Postgres Schema da ferramenta MTN
    defaultPrefixoAnalise: "Super ADM",
    prefixoAnalise: "9009",
    defaultTxtEsclarecimento: "Favor esclarecer a ocorrência",

    tituloEmail: "MTN - Notificação",
    tiposNotificacao: {
      INCLUIR_ENVOLVIDO: {
        id: "INCLUIR_ENVOLVIDO",
        template: "Mtn/IncluirEnvolvido",
      },
      INTERACAO: { id: "INTERACAO", template: "Mtn/Interacao" },

      SOLICITACAO_ESCLARECIMENTO: {
        id: "SOLICITACAO_ESCLARECIMENTO",
        template: "Mtn/Interacao",
      },
      RESPONDE_ESCLARECIMENTO: {
        id: "RESPONDE_ESCLARECIMENTO",
        template: "Mtn/Interacao",
      },

      PRAZO_ESCLARECIMENTO: {
        id: "PRAZO_ESCLARECIMENTO",
        template: "Mtn/PrazoEsclarecimento",
      },
      REVELIA_ESCLARECIMENTO: {
        id: "REVELIA_ESCLARECIMENTO",
        template: "Mtn/Interacao",
      },
      PRAZO_RECURSO: { id: "PRAZO_RECURSO", template: "Mtn/PrazoRecurso" },
      REVELIA_RECURSO: { id: "REVELIA_RECURSO", template: "Mtn/Interacao" },
      ALERTA_ETICO: {
        id: "INTERACAO",
        template: "Mtn/AlertaEtico",
        avisoRecebimento: true,
      },
    },

    //Status nos quais um MTN pode estar
    mtnStatus: {
      A_ANALISAR: 1,
      EM_ANALISE: 2,
      FINALIZADO: 3,
    },

    acoesInstancias: {
      SUPER: "SUPER",
      ENVOLVIDO: "ENVOLVIDO",
    },

    prazosRevelia: {
      // ATENÇÃO: SEMPRE QUE ESTE PRAZO FOR ALTERADO, ALTERAR
      // A CONSTANTE NO FRONT END
      RECURSO: 10,
      ESCLARECIMENTO: 5,
      QUESTIONARIO: 5,
      ESCLARECIMENTO_PRORROGADO: 10,
    },
    msgsRevelia: {
      vencido:
        "O pedido de esclarecimento deve ser respondido dentro do prazo de cinco dias trabalhados, prorrogáveis por mais cinco.",
      prorrogavel:
        "O pedido de esclarecimento deve ser respondido dentro do prazo de cinco dias trabalhados, caso queira prorrogar por igual período, clique no botão abaixo.",
      finalizado: "Solicitação finalizada pelo sistema.",
      recurso:
        "O recurso foi fechado à revelia devido ao encerramento da análise",
    },

    medidas: {
      ORIENTACOES: 1,
      NAO_COMPROVADA: 2,
      ALERTA_ETICO_NEGOCIAL: 3,
      TERMO_DE_CIENCIA: 40,
      GEDIP: 4,
      GEDIP_COMUM: 7,
      INDEVIDO: 5,
      NAO_ALCANCADO: 6,
      FALHA_PRODUTO_SERVICO: 10,
    },
    acoes: {
      CRIACAO: 1,
      SOLICITA_ESCLARECIMENTO: 2,
      RESPONDE_ESCLARECIMENTO: 3,
      FINALIZAR_ANALISE: 4,
      PARECER: 5,
      SALVAR_PARECER_RECURSO: 6,
      RESPONDER_RECURSO: 7,
      REVELIA_ESCLARECIMENTO: 8,
      REVELIA_RECURSO: 9,
      SOLICITA_ALTERACAO_MEDIDA: 10,
      CONFIRMA_ALTERACAO_MEDIDA: 11,
      ESCLARECIMENTO_INICIAL: 12,
      APROVAR_MEDIDA: 13,
      ENVIOU_PARA_APROVACAO: 14,      
      VERSIONAR_OCORRENCIA: 15,
      CRIACAO_NOVA_VERSAO: 16,
      DEVOLVER_PARA_ANALISE: 17
    },

    tiposAnexo: {
      PARECER: "PARECER", // Anexo de um parecer
      ESCLARECIMENTO: "ESCLARECIMENTO", // Anexo de um esclarecimento
      PARECER_RECURSO: "PARECER_RECURSO", // Anexo de um parecer que ficou disponível para recurso
      RECURSO: "RECURSO", // Anexo de um recurso
      ALTERACAO_MEDIDA: "ALTERACAO_MEDIDA",
      MTN_FECHADO_SEM_ENVOLVIDOS: "MTN_FECHADO_SEM_ENVOLVIDOS",
      FUNCI_FORA_ALCADA: "falhaProdutoServico",
      PREFIXO_FORA_ALCADA: "envolvidoForaAlcance",
    },
    //Filtros MTN possíveis
    filters: {
      EM_ANDAMENTO: "emAndamento",
      FINALIZADOS: "finalizados",
    },
  },

  EncantarConsts: {
    CAMINHO_COMMONS: "App/Commons/Encantar",
    TIPOS_ENVIO: {},
    REMETENTE_NOTIFICACOES: "superadm@naoresponder.bb.com.br",
    TIPOS_NOTIFICACAO: {
      FLUXO_APROVACAO: {
        tipo: "FLUXO_APROVACAO",
        template: "Encantar/NotificacaoFluxo",
      },
      FLUXO_REPROVACAO: {
        tipo: "FLUXO_REPROVACAO",
        template: "Encantar/NotificacaoSolicitacaoReprovada",
      },
      RESPONSAVEL_BRINDE: {
        tipo: "RESPONSAVEL_BRINDE",
        template: "Encantar/NotificacaoResponsavelBrinde",
      },
      ENVIO_PREFIXO: {
        tipo: "ENVIO_PREFIXO",
        template: "Encantar/NotificacaoEnvioPrefixo",
      },
    },
    LOCAL_ENTREGA: {
      AGENCIA: "Agência",
      ENDERECO_CLIENTE: "Endereço do Cliente",
    },
    TIPOS_APROVACAO: {
      DEFERIR: "deferir",
      INDEFERIR: "indeferir",
      REVELIA: "revelia",
    },
    CAMINHO_MODELS: "App/Models/Mysql/Encantar",
    ACOES_HISTORICO_SOLICITACAO: {
      INCLUIR_SOLICITACAO: 1,
      APROVACAO_FLUXO: 2,
      REPROVACAO_FLUXO: 3,
      REGISTRAR_ENTREGA: 5,
      REGISTRAR_RECEBIMENTO: 6,
      REGISTRAR_RECEBIMENTO_CLIENTE: 7,
      CANCELAMENTO: 8,
      REGISTRAR_ENTREGA_MAL_SUCEDIDA: 9,
      CANCELAR_DEVOLVIDA: 10,
      MARCAR_PARA_REENVIO: 11,
      REGISTRAR_ENTREGA_DEVOLVIDA: 12,
    },
    TRATAMENTOS_DEVOLUCAO: {
      CANCELAR: "Cancelar",
      REENVIAR: "Reenviar",
    },
    STATUS_SOLICITACAO: {
      PENDENTE_APROVACAO: 1,
      INDEFERIDA: 2,
      CANCELADA: 3,
      DEFERIDA: 4,
      ENTREGUE: 5,
      PENDENTE_RECEBIMENTO_PREFIXO: 6,
      ENTREGA_MAL_SUCEDIDA: 7,
      PENDENTE_ENTREGA: 8,
      PENDENTE_DEVOLVIDA: 9,
    },
    RESULTADO_ENTREGA_CLIENTE: {
      ENTREGUE_COM_SUCESSO: "Entregue com sucesso",
      DEVOLVIDO: "Devolvido",
      EXTRAVIADO: "Extraviado",
    },
    TIPOS_LANCAMENTOS: {
      CREDITO: 1,
      DEBITO: 2,
      RESERVA: 3,
      INDEFERIMENTO: 4,
      ENTREGA: 5,
    },
  },

  //Tipos de email -> CtrlDisciplinar
  tiposEmailsCtrlDiscp: {
    ENVIO_NORMAL: 1,
    ENVIO_COBRANCA: 2,
    ENVIO_DOCUMENTO: 3,
  },
};
