module.exports = class Constants {
  static DB_ENUM_ATIVOS = {
    ATIVO: "1",
    INATIVO: "0",
  };

  static MATRICULA_REGEX = /^(F|f)\d{7}$/;
  static PREFIXO_REGEX = /^\d{1,4}?$/;
  static FUNCAO_REGEX = /^\d{1,6}?$/;
  static OPORTUNIDADE_REGEX = /^[a-zA-Z]{3}[0-9]{5,6}?$/;
  static DATA_REGEX = /\b\d{2}\/\d{2}\/\d{4}\b/;

  static TP_IMPEDIMENTO = {
    IMPEDIDO: "IMPEDIDO",
    SEM_IMPEDIMENTO: "SEM IMPEDIMENTO",
  };

  static DESATUALIZADO = "DESATUALIZADO";

  static NEGATIVADO = {
    SIM: 1,
    NAO: null,
  };

  static FLAGS = {
    SIM: true,
    NAO: false,
  };

  static CD_QUALIF_CERT_CHN = [17, 18, 19];
  static CD_QUALIF_CERT_PROF = [21];
  static CD_QUALIF_SELEC_INT = [22];
  static CD_QUALIF_CERT_LEG = [25, 26, 27];
  static CD_QUALIF_CERT_LIN = [40, 41, 42, 43, 44, 45, 46, 47, 48];
  static CD_QUALIF_QUALIFIC = [50];
  static CD_QUALIF_COLAB_RS = [56];
  static CD_QUALIF_MENTOR = [58];
  static CD_QUALIF_REDES = [
    70, 71, 72, 73, 74, 75, 76, 78, 79, 80, 81, 82, 83, 84, 86, 91, 92,
  ];
  static CD_QUALIF_PIT = [93, 94, 95, 96, 97];
  static CD_QUALIF_QQ_CERT = [99];

  static QUALIFICACOES = [
    { cd: 17, nome: "CERT.CONHECIMENTO BÁSICO" },
    { cd: 18, nome: "CERT.CONHECIMENTO INTERMEDI" },
    { cd: 19, nome: "CERT.CONHECIMENTO AVANÇADO" },

    { cd: 21, nome: "CERTIFICAÇÃO PROFISSIONAL" },

    { cd: 22, nome: "PROVA INTERNA DE SELEÇÃO" },

    { cd: 25, nome: "CERT.LEGAL BASI.INV." },
    { cd: 26, nome: "CERT.LEGAL AVAN.INV." },
    { cd: 27, nome: "CERT.LEGAL OUTR.INV." },

    { cd: 40, nome: "CERT./LINGUAS-BASICO 2 ANOS" },
    { cd: 41, nome: "CERT./LINGUAS-INTERM 2 ANOS" },
    { cd: 42, nome: "CERT./LINGUAS-INTERM 3 ANOS" },
    { cd: 43, nome: "CERT./LINGUAS-AVANCA 2 ANOS" },
    { cd: 44, nome: "CERT./LINGUAS-AVANCA 4 ANOS" },
    { cd: 45, nome: "CERT./LINGUAS-SUPERI 2 ANOS" },
    { cd: 46, nome: "CERT./LINGUAS-SUPERI 5 ANOS" },
    { cd: 47, nome: "CERT./LINGUAS-DOMINI 2 ANOS" },
    { cd: 48, nome: "CERT./LINGUAS-DOMINI PERM" },

    { cd: 50, nome: "QUALIFICAÇÃO" },

    { cd: 56, nome: "COLABORADOR R&S" },
    { cd: 58, nome: "MENTOR" },

    { cd: 70, nome: "REDE VAREJO" },
    { cd: 71, nome: "REDE ATACADO" },
    { cd: 72, nome: "REDE PRIVATE" },
    { cd: 73, nome: "CRBB/SAC" },
    { cd: 74, nome: "GECOR" },
    { cd: 75, nome: "GEPES" },
    { cd: 76, nome: "AUDIT" },
    { cd: 78, nome: "CCBB" },
    { cd: 79, nome: "GECEX" },
    { cd: 80, nome: "CECAR" },
    { cd: 81, nome: "OUVIDORIA EXTERNA" },
    { cd: 82, nome: "REROP/GESIN" },
    { cd: 83, nome: "CSA" },
    { cd: 84, nome: "GERAC" },
    { cd: 86, nome: "REDE UOP" },
    { cd: 91, nome: "CESUP" },
    { cd: 92, nome: "GEINV" },

    { cd: 93, nome: "ENTRADA PIT+" },
    { cd: 94, nome: "ESPECIALIZADA 3 PIT+" },
    { cd: 95, nome: "ESPECIALIZADA 2 PIT+" },
    { cd: 96, nome: "ESPECIALIZADA 1 PIT+" },
    { cd: 97, nome: "ESPECIAL PIT+" },

    { cd: 99, nome: "QUALQUER CERTIFICAÇÃO" },
  ];

  static LISTA_CPA = {
    571: "CPA-20",
    101110: "CPA-20",
    572: "CPA-10",
    101109: "CPA-10",
    6784: "CEA",
    4160: "CEA",
  };

  static CODIGOS_CPA = ["CPA-10", "CPA-20"];

  static ACOES = {
    JUSTIFICATIVA: 1,
    MANIFESTACAO: 2,
    ANALISE: 3,
    DESPACHO: 4,
    DEFERIMENTO: 5,
    CANCELAMENTO: 6,
    FINALIZACAO: 7,
    DISPENSADO: 8,
    COMPLEMENTO: 9,
    AVOCAR: 10,
  };

  static SITUACOES = {
    PENDENTE: 1,
    REGISTRADA: 2,
    DISPENSADA: 3,
    NAO_VIGENTE: 4,
  };

  static DISPENSA_DEVIDO = {
    COMPLEMENTO_SOLICITADO: 6,
  };

  static LOCALIZACOES = {
    PREFIXOS: 1,
    GESTOR: 2,
    DIRETORIA: 3,
    GEPES: 4,
  };

  static STATUS = {
    MANIFESTACAO: 1,
    ANALISE: 2,
    DESPACHO: 3,
    DEFERIMENTO: 4,
    CANCELADO: 5,
    FINALIZANDO: 6,
    ENCERRADO: 7,
    COMPLEMENTACAO: 8,
  };

  static ETAPAS = {
    SOLICITACAO: 1,
    MANIFESTACOES: 2,
    ANALISE: 3,
    DESPACHO: 4,
    DEFERIMENTO: 5,
    FINALIZANDO: 6,
    ENCERRADO: 7,
  };

  static PARECER = {
    DESFAVORAVEL: 0,
    FAVORAVEL: 1,
  };

  static PARECER_STRING = {
    DESFAVORAVEL: "0",
    FAVORAVEL: "1",
  };

  static OPTS = {
    NAO: 0,
    SIM: 1,
  };

  static OPTS_STR = {
    NAO: "0",
    SIM: "1",
  };

  static ESCALOES = {
    1: "Comitê UE",
    2: "Administrador UE",
    3: "Membro do Comitê UE",
    4: "Matrícula",
  };

  static ESCALOES_INT = {
    COMITE: 1,
    ADMINISTRADOR: 2,
    MEMBRO_COMITE: 3,
    MATRICULA: 4,
  };

  static GFM_ESCRITURARIO = 100;

  static QUERY = {
    MINHAS_PENDENCIAS: 1,
    TODAS_ABERTAS_FECHADAS: 2,
    ATIVAS: 3,
    PENDENTES_MANIFESTACAO: 4,
    PENDENTES_ANALISE: 5,
    PENDENTES_DEFERIMENTO: 6,
    FINALIZADAS_CANCELADAS: 7,
    PENDENTES_DESPACHO: 8,
  };
  //corresponde a tabela solicitacoesFiltros
  static FILTROS = {
    MINHAS_PENDENCIAS: 1,
    PEDIDOS_ABERTOS: 2,
    AGUARDANDO_MANIFESTACAO: 3,
    EM_ANALISE: 4,
    AGUARDANDO_VOTACAO: 5,
    FINALIZADOS: 6,
    TODOS: 7,
  };
};
