module.exports = (dadosSubstituir) => {
  const newFunci = {
    matricula: "F0000000",
    nome: "FUNCIONÁRIO EXEMPLO",
    dataNasc: {},
    dataPosse: {},
    grauInstr: 1,
    codFuncLotacao: "00000",
    descFuncLotacao: "Função Exemplo",
    refOrganizacionalFuncLotacao: "3GUT",
    comissao: "00000",
    descCargo: "Função Exemplo",
    codSituacao: 100,
    dataSituacao: {},
    agenciaLocalizacao: "0000",
    prefixoLotacao: "0000",
    codUorTrabalho: "000000000",
    nomeUorTrabalho: "Local de Exemplo",
    codUorGrupo: "000000000",
    nomeUorGrupo: "Local",
    email: "funci.exemplo@bb.com.br",
    dddCelular: 0,
    foneCelular: 999999999,
    sexo: 1,
    estCivil: "2",
    nomeGuerra: "Exemplo",
    rg: "000000 - SSP - UF",
    cpf: "00000000000",
    dependencia: {
      subordinada: "00",
      uor: "000000000",
      gerev: "0000",
      super: "0000",
      diretoria: "0000",
      nome: "Local Exemplo",
      prefixo: "0000",
      uf: "UF",
      municipio: "Local",
    },
  };

  for (const campo of Object.keys(dadosSubstituir)) {
    if (newFunci[campo]) {
      newFunci[campo] = dadosSubstituir[campo];
    }
  }

  return newFunci;
};
