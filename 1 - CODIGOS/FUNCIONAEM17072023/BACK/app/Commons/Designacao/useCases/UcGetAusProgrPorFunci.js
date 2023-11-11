"use strict";

const { AbstractUserCase } = require("../../AbstractUserCase");

/**
 * Caso de Uso para obter as ausências programadas do funcionário informado,
 * transformando a matricula recebida em inteiro.
 */
class UcGetAusProgrPorFunci extends AbstractUserCase {
  async _action({
    matricula
  }) {
    const {
      funciRepository,
    } = this.repository;

    const matriculaInt = parseInt(matricula.replace(/\D/g, ''), 10);

    const ausencias = await funciRepository.getAusenciasProgramadas(matriculaInt);

    return ausencias;
  }

  _checks({
    matricula
  }) {
    if (!matricula) throw { message: "A matrícula do funcionário deve ser informada", status: 400 };
  }
}

module.exports = UcGetAusProgrPorFunci;
