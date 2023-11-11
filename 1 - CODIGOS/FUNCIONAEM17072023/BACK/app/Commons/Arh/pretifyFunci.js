/**
 * @param {RawFunci} funci versão do funci que vem do banco de dados
 * @param {{
 *  editNomeGuerra?: boolean | string, // se true, nomeGuerra será override. se string, é a mensagem de não achado
 *  withDependencia?: boolean,
 * }} options
 * @return {Funci}
 */
function pretifyFunci(funci, { editNomeGuerra = true, withDependencia = true } = {}) {
  if (editNomeGuerra !== false) {
    // @ts-expect-error tipo do nomeGuerra
    funci.nomeGuerra = funci.nomeGuerra
      ? funci.nomeGuerra.NOME_GUERRA_215.trim()
      : (typeof editNomeGuerra === 'string') ? editNomeGuerra : 'NÃO INFORMADO';
  }

  const transformed = {
    matricula: funci.matricula,
    nome: funci.nome,
    dataNasc: funci.data_nasc,
    dataPosse: funci.data_posse,
    grauInstr: funci.grau_instr,
    codFuncLotacao: funci.cod_func_lotacao,
    descFuncLotacao: funci.desc_func_lotacao,
    refOrganizacionalFuncLotacao: funci.dadosComissao
      ? funci.dadosComissao.ref_organizacional
      : null,
    comissao: funci.comissao,
    descCargo: funci.desc_cargo,
    codSituacao: funci.cod_situacao,
    dataSituacao: funci.data_situacao,
    agenciaLocalizacao: funci.ag_localiz,
    prefixoLotacao: funci.prefixo_lotacao,
    codUorTrabalho: funci.cod_uor_trabalho,
    nomeUorTrabalho: funci.nome_uor_trabalho,
    codUorGrupo: funci.cod_uor_grupo,
    nomeUorGrupo: funci.nome_uor_grupo,
    email: funci.email,
    dddCelular: funci.ddd_celular,
    foneCelular: funci.fone_celular,
    sexo: funci.sexo,
    estCivil: funci.estCivil?.descricaoResumida ?? "Não Informado",
    nomeGuerra: funci.nomeGuerra ? funci.nomeGuerra : "",
    rg: funci.rg_emissor_uf,
    cpf: funci.cpf_nr,
  };

  if (withDependencia && funci.dependencia) {
    transformed.dependencia = {
      subordinada: funci.dependencia.cd_subord,
      uor: funci.dependencia.uor_dependencia,
      gerev: funci.dependencia.cd_gerev_juris,
      super: funci.dependencia.cd_super_juris,
      diretoria: funci.dependencia.cd_diretor_juris,
      nome: funci.dependencia.nome,
      prefixo: funci.dependencia.prefixo,
      uf: funci.dependencia.nm_uf,
      municipio: funci.dependencia.municipio,
      endereco: getEnderecoCompleto(funci)
    };
  }

  for (const key in transformed) {
    transformed[key] =
      typeof transformed[key] === "string"
        ? transformed[key].trim()
        : transformed[key];
  }

  // @ts-ignore
  return transformed;
}

function getEnderecoCompleto(funci) {
  const { dependencia } = funci;

  return [
    dependencia.logradouro && `Endereço: ${dependencia.logradouro}`,
    dependencia.compl_logradouro && `Complemento: ${dependencia.compl_logradouro}`,
    dependencia.bairro && `Bairro: ${dependencia.bairro}`,
    (dependencia.municipio && dependencia.nm_uf) && `Cidade/UF: ${dependencia.municipio}/${dependencia.nm_uf}`,
    dependencia.cep && `CEP: ${dependencia.cep}`,
  ].filter(Boolean).join(' - ');
}

module.exports = pretifyFunci;


/**
 * @typedef {{
*  matricula: string;
*  nome: string;
*  email: string;
*  cpf_nr: string;
*  data_nasc: string;
*  data_posse: string;
*  grau_instr: number;
*  cod_func_lotacao: string;
*  desc_func_lotacao: string;
*  comissao: string;
*  desc_cargo: string;
*  cod_situacao: number;
*  data_situacao: string;
*  prefixo_lotacao: string;
*  desc_localizacao: string;
*  cod_uor_trabalho: string;
*  nome_uor_trabalho: string;
*  cod_uor_grupo: string;
*  nome_uor_grupo: string;
*  ddd_celular: number;
*  fone_celular: number;
*  sexo: number;
*  est_civil: string;
*  dt_imped_odi: string;
*  ag_localiz: string;
*  cargo: string;
*  dt_imped_remocao: string;
*  dt_imped_comissionamento: string;
*  dt_imped_pas: string;
*  dt_imped_instit_relac: string;
*  dt_imped_demissao: string;
*  dt_imped_bolsa_estudos: string;
*  rg_emissor_uf: string;
*  dependencia: {
*    prefixo: string;
*    nome: string;
*    cd_subord: string;
*    tip_dep: number;
*    uor_dependencia: string;
*    cd_gerev_juris: string;
*    cd_super_juris: string;
*    cd_diretor_juris: string;
*    diretoria: string;
*    super: string;
*    gerev: string;
*    nm_uf: string;
*    municipio: string;
*    logradouro: string;
*    compl_logradouro: string;
*    bairro: string;
*    cep: string;
*  },
*  dadosComissao: {
*    cod_comissao: string;
*    nome_comissao: string;
*    data_inicio: string;
*    data_fim: string;
*    ref_organizacional: string;
*    tipo_cod: number;
*    jornada: number;
*    ind_adiantamento: number;
*  },
*  nomeGuerra: {
*    matricula: string;
*    NOME_GUERRA_215: string;
*  },
*  estCivil: {
*    codigo: string;
*    descricaoResumida: string;
*    descricao: string;
*  };
*}} RawFunci
*/
