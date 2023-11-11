"use strict";
const { AbstractUserCase } = require("../../AbstractUserCase");

const { REGEX_VALOR_NUMERICO, REGEX_MATRICULA } = require("../../Regex");

class UcPesquisarOcorrenciasParaVersionar extends AbstractUserCase {
  async _checks({
    nrMtn,
    matriculaEnvolvido,
    matriculaAnalista,
    periodoPesquisa,
  }) {
    if (!periodoPesquisa) {
      throw new Error("O período de pesquisa é obrigatório.");
    }

    if(nrMtn && !REGEX_VALOR_NUMERICO.test(nrMtn)){
      throw new Error(
        `O número do MTN (${nrMtn}) deve ser somente numérico.`
        );
      }

    if(matriculaAnalista && !REGEX_MATRICULA.test(matriculaAnalista)){
      throw new Error(
        `Matrícula do analista (${matriculaAnalista}) está em um formato errado.`
      );
    }

    if(matriculaEnvolvido && !REGEX_MATRICULA.test(matriculaEnvolvido)){
      throw new Error(
        `Matrícula do envolvido (${matriculaEnvolvido}) está em um formato errado.`
      );
    }

    this.nrMtn = nrMtn ? nrMtn : null;
    this.matriculaEnvolvido = matriculaEnvolvido ?  matriculaEnvolvido :  null;
    this.matriculaAnalista = matriculaAnalista ? matriculaAnalista : null;
    this.dataInicio = periodoPesquisa[0];
    this.dataFinal = periodoPesquisa[1];

  }

  async _action() {
    const envolvidosParaReversao = await this.repository.envolvido.filtrarEnvolvidos({
      nrMtn: this.nrMtn,
      matriculaEnvolvido: this.matriculaEnvolvido,
      matriculaAnalista: this.matriculaAnalista,
      dataInicio: this.dataInicio,
      dataFinal: this.dataFinal
    })

    return envolvidosParaReversao;

  }
}

module.exports = UcPesquisarOcorrenciasParaVersionar;
