type DependenciaFunci = {
  subordinada: string;
  uor: string;
  gerev: string;
  super: string;
  diretoria: string;
  nome: string;
  prefixo: string;
  uf: string;
  municipio: string;
  endereco: string;
};

/**
 * Tipo do Funci baseado no que vem do "GetOneFunci" e similares.
 */
type Funci = {
  matricula: string;
  nome: string;
  dataNasc: Date | string;
  dataPosse: Date | string;
  grauInstr: number;
  codFuncLotacao: string;
  descFuncLotacao: string;
  refOrganizacionalFuncLotacao: string;
  comissao: string;
  descCargo: string;
  codSituacao: number;
  dataSituacao: Date | string;
  agenciaLocalizacao: string;
  prefixoLotacao: string;
  codUorTrabalho: string;
  nomeUorTrabalho: string;
  codUorGrupo: string;
  nomeUorGrupo: string;
  email: string;
  dddCelular: number;
  foneCelular: number;
  sexo: number;
  estCivil: string;
  nomeGuerra: string;
  rg: string;
  cpf: string;
  dependencia: DependenciaFunci;
};
