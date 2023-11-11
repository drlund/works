"use strict";

const { AbstractUserCase } = require("../../AbstractUserCase");

const { FUNCAO_REGEX } = require("../Constants");
const Prefixo = require("../Entidades/Prefixo");
const ComissoesFot09 = use("App/Models/Mysql/Arh/ComissoesFot09");

class UCObterDadosFuncao extends AbstractUserCase {
  async _checks(funcao, prefixo, usuario) {
    if (!usuario) {
      throw new Error("Necessário estar logado.");
    }

    if (!funcao) {
      throw new Error("Função não informada.");
    }
    if (!FUNCAO_REGEX.test(funcao)) {
      throw new Error("Função informada no formato errado.");
    }
  }
  async _action(funcao, prefixo) {
    const { arhMst } = this.repository;
    const consulta = await arhMst.obterDadosFuncao(funcao);
    if (!consulta) {
      this._throwExpectedError(
        "Função não encontrada, confirme o valor digitado.",
        400
      );
    }

    let resultado = Prefixo.transformFuncao(consulta);

    //DESCOMENTAR QUANDO FOR PRA PRODUÇÂO
    const vacancia = await ComissoesFot09.query()
      .where({
        cod_cargo: consulta.cod_comissao,
        cod_dependencia: prefixo,
      })
      .whereNot("qtde_vagas", 0)
      .first();

    resultado.vacancia = vacancia ? true : false;

    const cargoInexistente = await ComissoesFot09.query()
      .where({
        cod_cargo: consulta.cod_comissao,
        cod_dependencia: prefixo,
      })
      .first();

    resultado.cargoExiste = cargoInexistente ? true : false;
    /* 
    if (!vacancia) {
      this._throwExpectedError(
        "Não há vagas para a função desejada no prefixo informado.",
        400
      );
    } 
 */
    return resultado;
  }
}

module.exports = UCObterDadosFuncao;
