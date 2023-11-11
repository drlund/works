"use strict";
const _ = require('lodash');

const { AbstractUserCase } = require("../../AbstractUserCase");
const { TIP_DEP, PREFIXO_GENERICO, COMISSAO_ESCRITURARIO, CARGO_ESCRITURARIO } = require("../Constants");

class UcGetOrigem extends AbstractUserCase {
  origem = {};

  async _action({ funci }) {
    const orig = await this.repository.funciRepository.getFunciOrigem(funci);

    const [
      dadosUORTrabalho,
      dadosUORLocalizacao,
    ] = await Promise.all([
      this.repository.municipioRepository.getDadosUor(orig.prefixoLotacao.uor_dependencia),
      this.repository.municipioRepository.getDadosUor(orig.codUorLocalizacao.uor_dependencia),
    ]);

    [
      this.origem.treinamentos,
      this.origem.nivel_alfab
    ] = await Promise.all([
      this.repository.funciRepository.getTreinamentosRealizados(funci),
      this.repository.prefixoRepository.getNivelAlfab(orig.prefixoLotacao.nivel_agencia),
    ]);

    const [
      municipioLotacao,
      municipioLocaliz
    ] = await Promise.all([
      this.repository.municipioRepository.get(dadosUORTrabalho.CodigoMunicipio),
      this.repository.municipioRepository.get(dadosUORLocalizacao.CodigoMunicipio),
    ]);

    const municipio = municipioLotacao.Prefixo === municipioLocaliz.Prefixo
    ? municipioLocaliz : municipioLotacao;

    this.origem = {
      ...this.origem,
      matricula: orig.matricula,
      nome: orig.nome,
      cd_municipio_ibge: municipio.cd_municipio_ibge,
      cd_municipio_ibge_dv: municipio.cd_municipio_ibge + municipio.dv_municipio_ibge,
      cod_afr: orig.cod_afr,
      cod_uor_grupo: orig.cod_uor_grupo,
      // município de lotacao
      cd_subord_paa: orig.prefixoLotacao.cd_subord_paa === PREFIXO_GENERICO
        ? ''
        : orig.prefixoLotacao.cd_subord_paa,
      cd_super_juris: orig.prefixoLotacao.cd_super_juris,
      cd_municipio_ibge_dv_lotacao: municipioLotacao.cd_municipio_ibge + municipioLotacao.dv_municipio_ibge,
      cd_municipio_ibge_lotacao: municipioLotacao?.cd_municipio_ibge,
      cod_municipio_ibge: orig.prefixoLotacao.cd_municipio_ibge,
      cod_uor_pref_lotacao: orig.prefixoLotacao?.uor_dependencia,
      cod_uor_trabalho: orig.cod_uor_trabalho,
      dependencia_lotacao: orig.prefixoLotacao.nome,
      desc_func_lotacao: orig.desc_func_lotacao,
      dv_municipio_ibge_lotacao: municipioLotacao?.dv_municipio_ibge,
      funcao_lotacao: orig.funcao_lotacao,
      municipio_lotacao: municipioLotacao?.municipio,
      municipioUfLotacao: municipioLotacao.municipio + '/' + municipioLotacao.nm_uf,
      nivel_agencia: orig.prefixoLotacao.nivel_agencia,
      nm_uf_lotacao: municipioLotacao?.nm_uf,
      prefixo_lotacao: orig.prefixo_lotacao,
      prefixo: orig.prefixo_lotacao,
      tip_dep: orig.prefixoLotacao.tip_dep === TIP_DEP.PAA ? 'PAA' : '',
      uor_dependencia: orig.prefixoLotacao.uor_dependencia,
      // município de localização
      ag_localiz: orig.ag_localiz,
      cd_municipio_ibge_dv_localiz: municipioLocaliz?.cd_municipio_ibge + municipioLocaliz.dv_municipio_ibge,
      cd_municipio_ibge_localiz: municipioLocaliz?.cd_municipio_ibge,
      cod_uor_localizacao: orig.cod_uor_localizacao,
      comissao: orig.comissao,
      desc_cargo: orig.desc_cargo,
      dv_municipio_ibge_localiz: municipioLocaliz?.dv_municipio_ibge,
      municipio_localiz: municipioLocaliz?.municipio,
      municipioUfLocaliz: municipioLocaliz?.municipio + '/' + municipioLocaliz.nm_uf,
      nm_uf_localiz: municipioLocaliz?.nm_uf,
      nome_ag_localiz: orig.codUorLocalizacao.nome,
      nome_super_lotacao: orig.prefixoLotacao.cd_super_juris === PREFIXO_GENERICO
        ? ''
        : orig.prefixoLotacao.dadosSuper.nome,
      emSubstit: (orig.funcao_lotacao === CARGO_ESCRITURARIO ? orig.comissao !== COMISSAO_ESCRITURARIO : orig.funcao_lotacao !== orig.comissao)
      || (orig.prefixo_lotacao !== orig.ag_localiz),
    };

    return this.origem;
  }

  _checks({ funci }) {
    if (!funci) {
      throw new Error("O funcionário deve ser informado");
    }
  }

}


module.exports = UcGetOrigem;
