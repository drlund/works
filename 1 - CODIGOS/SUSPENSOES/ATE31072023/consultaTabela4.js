/**
 * O erro ocorre porque o método `raw` não está disponível na versão do AdonisJS 4.1 que você está usando.
 * 
 * Para fazer a concatenação dos campos "diretoria", "super", "gerev", "prefixo" e "matricula" no AdonisJS 4.1, 
 * você pode utilizar a função `raw` disponível no construtor da consulta para inserir expressões SQL 
 * diretamente na consulta.
 * 
 * Aqui está o código corrigido para a concatenação dos campos:
*/

"use strict";

const ParamSuspensao = use("App/Models/Mysql/movimentacoes/ParamSuspensao");

class ParametroSuspensaoRepository {
  async getSuspensoes() {
    const suspensaoData = await ParamSuspensao.query()
      .select(
        ParamSuspensao.raw(
          "CONCAT(diretoria, super, gerev, prefixo, matricula) as TIPO"
        ),
        "vicePresi as VALORES",
        "tipoSuspensao as TIPOSUSPENSAO",
        "validade as VALIDADE",
        "matriculaResponsavel as MATRICULARESPONSAVEL",
        "observacao as OBSERVACAO"
      )
      .where((builder) => {
        builder
          .where("vicePresi", "!=", "0")
          .orWhere("diretoria", "!=", "0")
          .orWhere("super", "!=", "0")
          .orWhere("gerev", "!=", "0")
          .orWhere("prefixo", "!=", "0")
          .orWhere("matricula", "!=", "0");
      })
      .fetch();

    return suspensaoData.toJSON();
  }

  /**
   * @param {{save: () => string;}} novaSuspensao
   */
  async gravarSuspensao(novaSuspensao) {
    await novaSuspensao.save();

    return novaSuspensao;
  }
}

module.exports = ParametroSuspensaoRepository;
