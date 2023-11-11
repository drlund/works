"use strict";

const exception = use('App/Exceptions/Handler');

const _ = require('lodash');

/**
 *
 *    Classe que fornece serviços relacionados a Arrays
 *
 */

module.exports = {
  /**
   *
   *   Transforma o array recebido para string, separando os itens por vírgula, colocando o
   *   'e' antes do último item (array.length > 1) e o ponto final (segundo parâmetro).
   *   Ex.: ['Carlos', 'João', 'Augusto'] => 'Carlos, João e Augusto'
   */
  arrayToString: (lista, ponto = false) => {

    if (!Array.isArray(lista)) {
      throw new Error("Valor recebido deve ser um array!");
    }

    const last = lista.slice(-1)[0];

    if (!last) {
      return "";
    }

    let result = lista.slice(0, -1).join(', ');

    if (result !== '') {
      result += ' e ';
    }

    result += last;

    if (ponto) {
      result += '.';
    }

    return result;

  },
};
