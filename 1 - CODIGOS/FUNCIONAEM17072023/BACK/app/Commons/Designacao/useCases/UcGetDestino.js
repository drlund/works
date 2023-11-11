"use strict";

const _ = require("lodash");
const { AbstractUserCase } = require("../../AbstractUserCase");

const { MATRICULA_GENERICA } = require("../Constants");

class UcGetDestino extends AbstractUserCase {
  destino = {};

  async _action({
    prefixo,
    funcionario
  }) {
    const dest = await this.repository.prefixoRepository.getDestino(prefixo, funcionario.funcao);
    const nivelAlfab = await this.repository.prefixoRepository.getNivelAlfab(dest.nivel_agencia);

    if (funcionario.funci && funcionario.funci !== MATRICULA_GENERICA) {
      const funci = await this.repository.funciRepository.getFunciDestino(funcionario.funci);
      const dadosUOR = await this.repository.municipioRepository.getDadosUor(funci.uor_trabalho);
      const municipio = await this.repository.municipioRepository.get(dadosUOR.CodigoMunicipio);

      this.destino = {
        ...this.destino,
        matricula: funci.matricula,
        nome_funci: funci.nome,
        cd_municipio_ibge: municipio.cd_municipio_ibge,
        dv_municipio_ibge: municipio.dv_municipio_ibge,
        municipio: municipio.municipio,
        nm_uf: municipio.nm_uf,
      }
    } else {
      this.destino = {
        ...this.destino,
        cd_municipio_ibge: dest.cd_municipio_ibge,
        dv_municipio_ibge: dest.dv_municipio_ibge,
        municipio: dest.municipio,
        nm_uf: dest.nm_uf,
      }
    }

    if (funcionario.funcao) {
      const {
        cpa,
        cpaLista
      } = await this.repository.funciRepository.getCPAFuncao(funcionario.funcao, dest.cd_diretor_juris);

      this.destino.cpa = [...cpa];
      this.destino.cpaLista = [...cpaLista];
    }

    if (funcionario.optbasica) {
      this.destino.optbasica = funcionario.optbasica;
    }

    this.destino = {
      ...this.destino,
      cd_super_juris: dest.cd_super_juris,
      nome: dest.nome,
      cod_comissao: dest.cod_comissao || '',
      nome_comissao: dest.nome_comissao || '',
      prefixo: dest.prefixo,
      dependencia: dest.nome,
      uor_dependencia: dest.uor_dependencia,
      tip_dep: dest.tip_dep,
      cd_subord_paa: dest.cd_subord_paa,
      nivel_agencia: dest.nivel_agencia,
      municipio: dest.municipio,
      nm_uf: dest.nm_uf,
      nivel_alfab: nivelAlfab,
      nome_super: dest.cd_super_juris === '0000' ? '' : dest.dadosSuper.nome,
      tip_dep: dest.tip_dep === 15 ? 'PAA' : '',
      cd_subord_paa: dest.cd_subord_paa === '0000' ? '' : dest.cd_subord_paa,
      municipioUf: this.destino.municipio + '/' + this.destino.nm_uf,
      cd_municipio_ibge_dv: this.destino.cd_municipio_ibge + this.destino.dv_municipio_ibge,
    }

    return this.destino;

  }

  _checks({ prefixo, funcionario = null }) {
    if (funcionario.funci) {
      if (!funcionario.funcao) {
        throw new Error("O tipo de movimentação deve ser informado");
      }
      if (!funcionario.optbasica) {
        throw new Error("As opções básicas de ausência devem ser informadas");
      }
    }

    if (!prefixo) {
      throw new Error("O tipo de movimentação deve ser informado");
    }
  }

}


module.exports = UcGetDestino;
