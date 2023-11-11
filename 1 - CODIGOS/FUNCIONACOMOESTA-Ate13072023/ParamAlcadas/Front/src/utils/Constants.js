const constants = {
  ID_STATUS_FINALIZADO: 3,

  MTN: {
    // ATENÇÃO: Sempre que esta constante for alterada, deve-se alterar
    // também no backend
    prazoMaxRecurso: 10,
    medidas: {
      FALHA_PRODUTO_SERVICO: 10,
      IRREGULARIDADE_FUNCIONAL_NAO_COMPROVADA: 2,
    },
    tipoComplemento: {
      TIPO_FALHA_PRODUTO_SERVICO: 'falhaProdutoServico',
      ENVOLVIDO_FORA_ALCANCE: 'envolvidoForaAlcance',
    },
  },

  MTN_COMITE: {
    STATUS_PARAMETROS: {
      PENDENTE_VOTACAO: 1,
      EM_VOTACAO: 2,
      APROVADO: 3,
      ALTERACAO_PENDENTE: 4,
    },

    // Em caso de alteração mudar no backend
    ACOES_PARA_VOTACAO: {
      ALTERAR_PARAMETRO: "Alterar Parâmetro",
      SUSPENDER: "Suspender",
      RECUSAR: "Recusar",
      INATIVAR: "Inativar",
    },

    // Em caso de alteração mudar no backend
    ACOES_TRATAR_ALTERACAO: {
      ACEITAR: "Aceitar",
      RECUSAR: "Recusar",
    },

    ACOES_VOTO: {
      APROVAR: 1,
      ALTERAR: 2,
    },

    TIPO_VOTO_PARAMETRO: {
      APROVADO: 1,
      AGUARDANDO_ALTERACOES: 2,
      ENCERRADO: 3,
    },
  },

  ENCANTAR: {
    PENDENTE_DEFERIMENTO: 1,
    INDEFERIDA: 2,
    CANCELADA: 3,
    DEFERIDA: 4,
    ENTREGUE: 5,
    PENDENTE_RECEBIMENTO: 6,
    ENTREGA_MAL_SUCEDIDA: 7,
    ENTREGA_AGENCIA: 'Agência',
    ENTREGA_ENDERECO_CLIENTE: 'Endereço do Cliente',
  },

  CORES_BB: {
    amarelo: '#FFD700',
    bbAmarelo: '#CEB11A',
    bbAzul: '#002D4B',
    bbBranco: '#FFFFFF',
    bbCinzaClaro: '#AFAFAF',
    bbCinzaEscuro: '#69696E',
    bbRosaClaro: '#DCA09B',
    bbRosaEscuro: '#B47D7D',
    bbRoxoClaro: '#B4AFD2',
    bbRoxoEscuro: '#9187AF',
    bbVerdeClaro: '#87C3BE',
    bbVerdeEscuro: '#5AAAA0',
    vermelho: '#FF0000',
    amarelo: '#CEB11A',
    verde: '#28A726',
    azul: '#1890FF',
  },
};

export default constants;
