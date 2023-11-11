"use strict";

const { AbstractUserCase } = require("../../AbstractUserCase");

class UcMatchedCodsAusencia extends AbstractUserCase{
  async _action ({codigo, lista}) {
    const { codigoAusenciaRepository } = this.repository;
    const codigosAusencia = await codigoAusenciaRepository.getFilteredCodigos({codigo, lista});

    return codigosAusencia;
  }

  _checks ({codigo, lista}) {
    if (codigo) {
      if (!['string', 'number'].includes(typeof codigo)) {
        throw {
          message: "O valor do código não é string nem número!"
        }
      }
    }
    if (lista) {
      if (!Array.isArray(lista)) {
        throw {
          message: "a lista não é um array"
        }
      }
    }
  };
}

module.exports = UcMatchedCodsAusencia;
