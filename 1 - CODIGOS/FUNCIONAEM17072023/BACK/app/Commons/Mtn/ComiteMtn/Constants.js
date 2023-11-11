const STATUS = {
  COM_PARAMETROS_APROVADOS: 1,
  EM_VOTACAO: 2,
  PENDENTE_INCLUSAO_PARAMETROS: 4,
  SUSPENSO: 5,
  RECUSADO: 6,
  INATIVO: 7,
};

const PREFIXO_SUPERADM = "9009";
const COD_COMITE_ADM = 311;

const STATUS_PARAMETROS = {
  PENDENTE_VOTACAO: 1,
  EM_VOTACAO: 2,
  APROVADO: 3,
  ALTERACAO_PENDENTE: 4,
  SUBSTITUIDO: 5,
  EXCLUIDO: 6,
};

// Caso altere aqui, também o faça no frontend
const ACOES_PARA_VOTACAO = {
  ALTERAR_PARAMETRO: "Alterar Parâmetro",
  SUSPENDER: "Suspender",
  RECUSAR: "Recusar",
  INATIVAR: "Inativar",
  ACEITAR_ALTERACAO_PARAMETRO: "Aceitar Alteração",
};

// Caso altere aqui, também o faça no frontend
const ACOES_TRATAR_ALTERACAO = {
  ACEITAR: "Aceitar",
  RECUSAR: "Recusar",
};

/** Indica qual voto foi escolhido pelo funcionário */
const TIPOS_VOTOS = {
  APROVAR: 1,
  ALTERAR: 2,
  ENCERRADA: 3,
  CANCELADA: 4,
};

const TIPO_VOTO_OBRIGATORIO = 5;

/** Quantidade de votos necessários para fechar uma votação do comitê mtn */
const QTD_VOTOS_COMITE = 3;

const ACOES_TIMELINE = {
  CRIAR_MONITORAMENTO: "Criar Monitoramento",
  INCLUIR_PARAMETROS: "Incluir Parâmetros",
  VOTAR_PARAMETRO_APROVAR: "Aprovou Parâmetros",
  VOTAR_PARAMETRO_ALTERAR: "Solicitou alterações",
};

module.exports = {
  PREFIXO_SUPERADM,
  COD_COMITE_ADM,
  STATUS,
  STATUS_PARAMETROS,
  TIPOS_VOTOS,
  ACOES_TIMELINE,
  TIPO_VOTO_OBRIGATORIO,
  QTD_VOTOS_COMITE,
  ACOES_TRATAR_ALTERACAO,
  ACOES_PARA_VOTACAO,
};
