const ESTADOS = {
  RASCUNHO: 1,
  PENDENTE_ASSINATURA_DESIGNANTES: 2,
  VIGENTE: 3,
  VIGENTE_PROVISORIA: 4,
  REVOGADA: 5,
  EXCLUIDA: 6
}

const TIPO_PARTICIPANTE = {
  DESIGNANTE: "designante",
  DESIGNADO: "designado",
  COLABORADOR: "colaborador",
  DEPENDENCIA: "dependência",
  AMBOS: "ambos" /* designante | designado */
}

const TIPOS_VINCULOS = {
  MATRICULA_INDIVIDUAL: { 
    id: 1, 
    titulo: "Matrícula Individual",
    tipoParticipante: TIPO_PARTICIPANTE.AMBOS
  },

  PREFIXO: { 
    id: 2, 
    titulo: "Prefixo",
    tipoParticipante: TIPO_PARTICIPANTE.DESIGNADO
  },

  CARGO_COMISSAO: { 
    id: 3, 
    titulo: "Cargo/Comissão",
    tipoParticipante: TIPO_PARTICIPANTE.DESIGNADO
  },

  COMITE: { 
    id: 4, 
    titulo: "Comitê",
    tipoParticipante: TIPO_PARTICIPANTE.AMBOS
  }
}

const MATRIZ_COR_ESTADOS = {
  [ESTADOS.RASCUNHO]: "#1890ff",
  [ESTADOS.PENDENTE_ASSINATURA_DESIGNANTES]: "#a40ea4",
  [ESTADOS.VIGENTE]: "#52c41a",
  [ESTADOS.VIGENTE_PROVISORIA]: "#faad14",
  [ESTADOS.REVOGADA]: "#7d7b7b",
  [ESTADOS.EXCLUIDA]: "#F42937"
}


export {
  ESTADOS,
  TIPO_PARTICIPANTE,
  TIPOS_VINCULOS,
  MATRIZ_COR_ESTADOS
}