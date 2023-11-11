const REGEX_ACESSO = {
  PREFIXOS: /\b\d{4}\b/,
  UORS: /\b\d{9}\b/,
  MATRICULAS: /\b[FfAaCc]\d{7}\b/,
  COMITES: /\bC\d{4}\b/,
  COMISSOES: /\b\d{6}\b/,
  RFOS: /\b[1-5][AEGOT]U[ETAN]\b/,
};

const TAMANHOS_TIPOS = {
  prefixo: 4,
  uor: 9,
  matricula: 8,
  comite: 5,
  comissao: 6,
  rfo: 4,
};

const NOMES_TIPOS = {
  prefixo: 'prefixo',
  uor: 'uor',
  matricula: 'matrícula',
  comite: 'comitê',
  comissao: 'comissão',
  rfo: 'rfo',
};

const NOMES_TIPOS_DB = {
  PREFIXO: 'prefixo',
  UOR: 'uor',
  MATRICULA: 'matricula',
  COMITE: 'comite',
  COMISSAO: 'comissao',
  RFO: 'rfo',
};

const LISTA_TIPOS = [
  'prefixo',
  'uor',
  'matricula',
  'comite',
  'comissao',
  'rfo',
];

const IDS_TIPOS = {
  prefixo: '63a5daf15562a5ae0aeeb273',
  uor: '63a5db0a5562a5ae0aeeb39c',
  matricula: '63a5db1f5562a5ae0aeeb4ce',
  comite: '63a5db315562a5ae0aeeb595',
  comissao: '63a5db405562a5ae0aeeb69d',
  rfo: '63a5db495562a5ae0aeeb723',
};

const MENSAGENS_LOG = {
  NOVO: `{1} :: Acesso concedido pelo funcionário {2} {3}.`,
  ATUALIZACAO: `{1} :: Acesso atualizado pelo funcionário {2} {3}.`,
  REVOGACAO: `{1} :: Acesso revogado pelo funcionário {2} {3}.`,
  PRESCRITO: `{1} :: Acesso invalidado automaticamente por alcançar data de validade.`,
  ALT_PREFIXO: `{1} :: Acesso invalidado automaticamente por alteração de prefixo do funcionário.`,
  N_LOCALIZADO: `{1} :: Acesso revogado automaticamente por: funcionário não localizado nas bases (FOT01)`
};

const ESTADOS = {
  ATIVO: 1,
  INATIVO: 0,
};

module.exports = {
  REGEX_ACESSO,
  TAMANHOS_TIPOS,
  NOMES_TIPOS,
  IDS_TIPOS,
  LISTA_TIPOS,
  MENSAGENS_LOG,
  ESTADOS,
  NOMES_TIPOS_DB,
};

