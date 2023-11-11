"use strict";

class Outorgado {
  /**
   * @param {Funci} dadosFunci
   */
  transformFunciOutorgado(dadosFunci) {
    return {
      matricula: dadosFunci.matricula,
      cpf: dadosFunci.cpf,
      rg: dadosFunci.rg,
      nome: dadosFunci.nome,
      estadoCivil: dadosFunci.estCivil,
      cargoCodigo: dadosFunci.codFuncLotacao,
      cargoNome: dadosFunci.descCargo,
      lotacaoCodigo: dadosFunci.dependencia.prefixo,
      lotacaoNome: dadosFunci.dependencia.nome,
      lotacaoMunicipio: dadosFunci.dependencia.municipio,
      lotacaoUf: dadosFunci.dependencia.uf,
      lotacaoEndereco: dadosFunci.dependencia.endereco,
    };
  }
}

module.exports = Outorgado;
