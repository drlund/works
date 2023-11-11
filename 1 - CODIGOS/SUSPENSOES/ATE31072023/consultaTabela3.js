/**
 * Para compor o valor da coluna "TIPO" com os campos "diretoria", "super", "gerev", "prefixo" e "matricula", você pode 
 * utilizar a função `CONCAT` do SQL para concatenar esses valores em uma única coluna.
 * 
 * Aqui está o código corrigido para incluir os campos "diretoria", "super", "gerev", "prefixo" e "matricula" na coluna "TIPO":
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
