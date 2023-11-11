const Constantes = {
  FUNCAO_GG: 'GER GERAL UN',
  COMISSAO_INESIST: 'COMISSÃO INEXISTENTE NO PREFIXO DE DESTINO',
  NAO_CAPACITADO: 'NÃO CAPACITADO',
  CAPACITADO: 'CAPACITADO',
  REGULAMENTO_BB: 'OPCAO REGULAMENTO PESSOAL BANCO DO BRASIL',
  REGULAMENTO_NAO_BB: 'INCORPORADO NÃO OPTOU PELO REGUL. BB',
  REGULAMENTO_SIM_BB: 'INCORPORADO OPTANTE PELO REGUL. BB',
  REGULAMENTO_FUNCI_BB: 'FUNCI BB',
  SEM_IMPEDIMENTO: 'SEM IMPEDIMENTO',
  PENDENTE_POSSE: 'PENDENTE DE POSSE',
  LIMITROFE: 'SÃO LIMÍTROFES OU REG. METROPOLITANA',
  NAO_LIMITROFE: 'NÃO SÃO LIMÍTROFES NEM REG. METROPOLITANA',
  MUNICIPIO_INVALIDO: 'MUNICÍPIO INVÁLIDO',
  SEM_CERTIFICACAO: 'NÃO POSSUI CERTIFICAÇÃO',
  COM_CPA: 'POSSUI CERTIFICAÇÃO EXIGIDA',
  SEM_CPA: 'NÃO POSSUI CERTIFICAÇÃO EXIGIDA',
  NAO_CPA: 'CPA NÃO EXIGIDA',
  FLEX_CPA: 'EXIGÊNCIA DE CPA FLEXIBILIZADA',
  POSSE_90: 'POSSE A MENOS DE 90 DIAS',
  TIPO: [
    {
      key: 1,
      nomeCurto: 'designacao',
      nome: 'Designação Interina'
    },
    {
      key: 2,
      nomeCurto: 'adicao',
      nome: 'Adição'
    },
    {
      key: "3",
      nomeCurto: "remocao",
      nome: "Remoção Excepcional"
    },
    {
      key: "4",
      nomeCurto: "permuta",
      nome: "Permuta de Comissionados"
    }
  ]
}

module.exports = Constantes;