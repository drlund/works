const solicitacaoFiltros = [
  { id: 1, nome: 'Minhas Pendências' },
  { id: 2, nome: 'Pedidos Abertos' },
  { id: 3, nome: 'Aguardando Manifestação' },
  { id: 4, nome: 'Em Análise' },
  { id: 5, nome: 'Aguardando Votação' },
  { id: 6, nome: 'Finalizados' },
];

const dataEtapas = [
  {
    id: 1,
    sequencial: 1,
    etapa: 'Solicitação',
  },
  {
    id: 2,
    sequencial: 2,
    etapa: 'Manifestações',
  },
  {
    id: 3,
    sequencial: 3,
    etapa: 'Análise',
  },
  {
    id: 4,
    sequencial: 4,
    etapa: 'Deferimento',
  },
  {
    id: 5,
    sequencial: 5,
    etapa: 'Finalizado',
  },
];

const manifestacoesData = [
  {
    id: 3,
    idSolicitacao: 1,
    acao: {
      id: 1,
      nome: 'Justificativa',
    },
    situacao: {
      id: 2,
      nome: 'Registrada',
    },
    ordemManifestacao: 1,
    parecer: 1,
    texto: 'Quero este funcionário de qualquer jeito.',
    matricula: 'F1237654',
    nome: 'Felícia Hardy',
    funcao: '123',
    nomeFuncao: 'Gerente Geral',
    prefixo: '1234',
    nomePrefixo: 'Ag. Queens',
  },
  {
    id: 5,
    idSolicitacao: 1,
    acao: {
      id: 2,
      nome: 'Manifestação',
    },
    situacao: {
      id: 2,
      nome: 'Registrada',
    },
    ordemManifestacao: 2,
    parecer: 1,
    texto: 'Posso mandar o funcionário.',
    matricula: 'F9876543',
    nome: 'Wilson Fisk',
    funcao: '123',
    nomeFuncao: 'Gerente Geral',
    prefixo: '2234',
    nomePrefixo: 'Ag. Nova York',
  },
  {
    id: 6,
    idSolicitacao: 1,
    acao: {
      id: 2,
      nome: 'Manifestação',
    },
    situacao: {
      id: 1,
      nome: 'Pendente',
    },
    ordemManifestacao: 3,
    parecer: 1,
    texto: null,
    matricula: null,
    nome: null,
    funcao: '123',
    nomeFuncao: 'Superintendente Comercial',
    prefixo: '3321',
    nomePrefixo: 'Super Hyper',
  },
  {
    id: 8,
    idSolicitacao: 1,
    acao: {
      id: 2,
      nome: 'Manifestação',
    },
    situacao: {
      id: 1,
      nome: 'Pendente',
    },
    ordemManifestacao: 4,
    parecer: null,
    texto: null,
    matricula: null,
    nome: null,
    funcao: null,
    nomeFuncao: 'Superintendente Comercial',
    prefixo: null,
    nomePrefixo: 'Super Boy',
  },
  {
    id: 9,
    idSolicitacao: 1,
    acao: {
      id: 2,
      nome: 'Manifestação',
    },
    situacao: {
      id: 1,
      nome: 'Pendente',
    },
    ordemManifestacao: 5,
    parecer: null,
    texto: null,
    matricula: null,
    nome: null,
    funcao: null,
    nomeFuncao: 'Superintendente Negocial',
    prefixo: null,
    nomePrefixo: 'Super Blaster',
  },
  {
    id: 10,
    idSolicitacao: 1,
    acao: {
      id: 2,
      nome: 'Manifestação',
    },
    situacao: {
      id: 1,
      nome: 'Pendente',
    },
    ordemManifestacao: 6,
    parecer: null,
    texto: null,
    matricula: null,
    nome: null,
    funcao: null,
    nomeFuncao: 'Superintendente Negocial',
    prefixo: null,
    nomePrefixo: 'Super Man',
  },
];

const manifestacoesData2 = [
  {
    id: 3,
    idSolicitacao: 1,
    acao: {
      id: 1,
      nome: 'Justificativa',
    },
    situacao: {
      id: 2,
      nome: 'Registrada',
    },
    ordemManifestacao: 1,
    parecer: 1,
    texto:
      'Este funcionário deve estar no meu jornal pois ele também acha que pessoas mascaradas são uma ameaça a cidade de NY.',
    matricula: 'F1237654',
    nome: 'J Jonas Jameson',
    funcao: '123',
    nomeFuncao: 'Gerente Geral',
    prefixo: '1234',
    nomePrefixo: 'Ag. Queens',
    updatedAt: '18:41:20 06/04/2023',
  },
  {
    id: 5,
    idSolicitacao: 1,
    acao: {
      id: 2,
      nome: 'Manifestação',
    },
    situacao: {
      id: 2,
      nome: 'Registrada',
    },
    ordemManifestacao: 2,
    parecer: 1,
    texto: 'Posso mandar o funcionário.',
    matricula: 'F9876543',
    nome: 'Wilson Fisk',
    funcao: '123',
    nomeFuncao: 'Gerente Geral',
    prefixo: '2234',
    nomePrefixo: 'Ag. Nova York',
    updatedAt: '18:41:20 06/04/2023',
  },
  {
    id: 6,
    idSolicitacao: 1,
    acao: {
      id: 2,
      nome: 'Manifestação',
    },
    situacao: {
      id: 2,
      nome: 'Registrada',
    },
    ordemManifestacao: 3,
    parecer: 1,
    texto: null,
    matricula: null,
    nome: null,
    funcao: '123',
    nomeFuncao: 'Superintendente Comercial',
    prefixo: '3321',
    nomePrefixo: 'Super Hyper',
    updatedAt: '18:41:20 06/04/2023',
  },
  {
    id: 8,
    idSolicitacao: 1,
    acao: {
      id: 2,
      nome: 'Manifestação',
    },
    situacao: {
      id: 2,
      nome: 'Registrada',
    },
    ordemManifestacao: 4,
    parecer: null,
    texto: null,
    matricula: null,
    nome: null,
    funcao: null,
    nomeFuncao: 'Superintendente Comercial',
    prefixo: null,
    nomePrefixo: 'Super Boy',
    updatedAt: '18:41:20 06/04/2023',
  },
  {
    id: 9,
    idSolicitacao: 1,
    acao: {
      id: 2,
      nome: 'Manifestação',
    },
    situacao: {
      id: 2,
      nome: 'Registrada',
    },
    ordemManifestacao: 5,
    parecer: null,
    texto: null,
    matricula: null,
    nome: null,
    funcao: null,
    nomeFuncao: 'Superintendente Negocial',
    prefixo: null,
    nomePrefixo: 'Super Blaster',
    updatedAt: '18:41:20 06/04/2023',
  },
  {
    id: 10,
    idSolicitacao: 1,
    acao: {
      id: 2,
      nome: 'Manifestação',
    },
    situacao: {
      id: 2,
      nome: 'Registrada',
    },
    ordemManifestacao: 6,
    parecer: null,
    texto: null,
    matricula: null,
    nome: null,
    funcao: null,
    nomeFuncao: 'Superintendente Negocial',
    prefixo: null,
    nomePrefixo: 'Super Man',
    updatedAt: '18:41:20 06/04/2023',
  },
];

const funciEnvolvido = {
  matricula: 'F3283371',
  nome: 'Fernando Vieira da Silva',
  funcaoLotacao: '14011',
  descricaoCargo: 'ASSESSOR I UT',
  prefixoOrigem: {
    prefixo: '9009',
    nome: 'SUPER ADM',
    prefixoDiretoria: '9010',
    nomeDiretoria: 'UAC-ATEND. CANAIS',
    clarosOrigem: '10%',
  },
  prefixoDestino: {
    prefixo: '4563',
    nome: 'HQ Avenger',
    prefixoDiretoria: '6412',
    nomeDiretoria: 'Shield',
    clarosDestino: '0,1%',
  },
};

const dadosFuncao = {
  codigo: '00001',
  nome: 'Super Hero',
};

const funcionarioAnalise = {
  // se refere aos prefixos envolvidos
  // dependo do vr informado
  tipoMovimentacao: 'string',

  movimentacao: [
    // após selecionado o destino, o tipo de movimentação depende da limitrocência dos prefixos de origem e destino
    {
      nome: 'vantagemNomeacao',
      valor: 'string sim ou não',
      flag: undefined,
      label: 'Vantagem na Nomeação',
    },
    {
      nome: 'distanciaRod',
      valor: 'string',
      flag: undefined,
      label: 'Distância por rodovia',
    },
    {
      nome: 'distanciaLinear',
      valor: 'string',
      flag: undefined,
      label: 'Distância linear',
    },
    {
      nome: 'municipiosOrigDest',
      valor: 'string sim ou não',
      flag: true,
      label: 'Origem/Dest limitrofes',
    },
  ],

  pit: {
    valor: 'sim ou não',
    lista: [
      {
        tpQualificacao: 'quali.CD_TIP_CTFC',
        cdQualificacao: 'quali.CD_OPT_CTFC_FUN',
        cdConhecimentoQualificacao: 'quali.CD_CNH_CTFC_FUN',
        cdCsoQualificacao: 'quali.CD_CSO_CTFC_FUN',
        dataExpiracaoQualificacao: 'DD/MM/YYYY',
      },
    ],
  },
  qualificado: {
    valor: 'sim ou não',
    lista: [
      {
        tpQualificacao: 'quali.CD_TIP_CTFC',
        cdQualificacao: 'quali.CD_OPT_CTFC_FUN',
        cdConhecimentoQualificacao: 'quali.CD_CNH_CTFC_FUN',
        cdCsoQualificacao: 'quali.CD_CSO_CTFC_FUN',
        dataExpiracaoQualificacao: 'DD/MM/YYYY',
      },
    ],
  },

  validacao: [
    // se refere a qualificação individual do funci a ser movimentado
    {
      nome: 'certificacao',
      valor: 'string',
      flag: true,
      label: 'Certificação',
    },
    {
      nome: 'trilhaEtica',
      valor: 'string',
      flag: false,
      label: 'Trilha Ética',
    },
    // se refere a validações impeditivas
    { nome: 'posseBB', valor: 'data', flag: true, label: 'Data de posse' },
    {
      nome: 'pendentePosse',
      valor: 'string',
      flag: false,
      label: 'Posse pendente',
    },
    { nome: 'inamovivel', valor: 'string', flag: true, label: 'Inamovível' },
    {
      nome: 'habitualidade',
      valor: 'string',
      flag: false,
      label: 'Habitualidade',
    },
    { nome: 'incorporado', valor: 'string', flag: '0', label: 'Incorporado' }, // string 0 não funciona, precisa ser int
    {
      nome: 'impedimentoODI',
      valor: 'string',
      flag: true,
      label: 'Impedimento ODI',
    },
    { nome: 'vcp', valor: 'string', flag: '0', label: 'VCP' },
    {
      nome: 'inabilitadoTCU',
      valor: 'string',
      flag: 0,
      label: 'Inabilitado TCU',
    },
  ],
};

const dataPrefixoDestino = {
  // Destino
  prefixo: '0000',
  nome: 'nome prefixo',
  prefixoDiretoria: '9010',
  nomeDiretoria: 'UAC-ATEND. CANAIS',
  clarosDestino: 'campo calculado??',
};

const dataTipoFlex = [
  {
    id: 1,
    nome: 'Critérios',
    cor: '#576ba5',
    ativo: 1,
  },
  {
    id: 2,
    nome: 'Institucional/Relacionamento',
    cor: '#fa9a50',
    ativo: 1,
  },
];

const dataListaPedidosFlex = [
  {
    id: 1,
    status: { id: 1, nome: 'Aguardando Manifestação' },
    localizacao: { id: 1, nome: 'Prefixos Envolvidos' },
    etapa: { id: 2, nome: 'Manifestações', sequencial: 1 },
    manifestacoes: manifestacoesData,
    tipo: dataTipoFlex,
    funcionarioEnvolvido: funciEnvolvido,
  },
  {
    id: 2,
    status: { id: 2, nome: 'Em Análise' },
    localizacao: { id: 2, nome: 'Gestor' },
    etapa: { id: 3, nome: 'Análise', sequencial: 2 },
    manifestacoes: manifestacoesData,
    tipo: dataTipoFlex,
    funcionarioEnvolvido: funciEnvolvido,
  },
];

const dataPedido = [
  {
    id: 1,
    status: { id: 1, nome: 'Aguardando Manifestação' },
    localizacao: { id: 1, nome: 'Prefixos Envolvidos' },
    etapa: { id: 2, nome: 'Manifestações', sequencial: 1 },
    manifestacoes: manifestacoesData,
    funcionarioEnvolvido: funciEnvolvido,
    matriculaSolicitante: 'F4683333',
    nomeSolicitante: 'Jefferson de Carvalho Alexandre',
  },
  {
    id: 2,
    status: { id: 2, nome: 'Em Análise' },
    localizacao: { id: 2, nome: 'Gestor' },
    etapa: { id: 3, nome: 'Análise', sequencial: 2 },
    manifestacoes: manifestacoesData2,
    funcionarioEnvolvido: funciEnvolvido,
    matriculaSolicitante: 'F8523641',
    nomeSolicitante: 'J Jonas Jameson',
  },
];
const pedidoSelecionado = (id) =>
  dataPedido.find((pedido) => pedido.id === parseInt(id));

// tela inicial
export const getEtapasMock = async () => dataEtapas;
export const getListaPedidosMock = async () => dataListaPedidosFlex;

// tela inclusão
export const getFuncionarioMock = async () => funciEnvolvido;
export const getFuncionarioAnaliseMock = async () => funcionarioAnalise;
export const getPrefixoDestinoMock = async () => dataPrefixoDestino;
export const getFuncaoMock = async () => dadosFuncao;
export const getTipoFlexMock = async () => dataTipoFlex;
export const getPedidoMock = async (id) => pedidoSelecionado(id);

export const inserirPedidoFlexMock = async (pedido) => console.log(pedido);
export const inserirManifestacaoMock = async (manifestacao) =>
  console.log(manifestacao);
export const inserirAnaliseMock = async (analise) => console.log(analise);
export const inserirDespachoMock = async (despacho) => console.log(despacho);
export const inserirDeferiementoMock = async (deferir) => console.log(deferir);
export const inserirFinalizacaoMock = async (finalizar) => console.log(finalizar);
export const getSolicitacaoFiltrosMock = async () => solicitacaoFiltros;
