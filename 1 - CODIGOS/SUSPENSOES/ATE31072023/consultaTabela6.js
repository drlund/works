/**
 * Agora está claro que você precisa refletir a consulta da view em sua repository. Para isso, você pode fazer uso 
 * das cláusulas `UNION` na query.

Aqui está o código ajustado na sua repository:
*/

"use strict";

const ParamSuspensao = use("App/Models/Mysql/movimentacoes/ParamSuspensao");

class ParametroSuspensaoRepository {
  async getSuspensoes() {
    const suspensaoData = await ParamSuspensao.query()
      .select(
        ParamSuspensao.raw("'Vice Presidencia' AS tipo"),
        "vicePresi as valor",
        "tipoSuspensao",
        "validade"
      )
      .where("vicePresi", "!=", "0")
      .union(function () {
        this.select(
          ParamSuspensao.raw("'Unidade Estratégica' AS tipo"),
          "diretoria as valor",
          "tipoSuspensao",
          "validade"
        )
        .where("diretoria", "!=", "0");
      })
      .union(function () {
        this.select(
          ParamSuspensao.raw("'Unidade Tática' AS tipo"),
          "super as valor",
          "tipoSuspensao",
          "validade"
        )
        .where("super", "!=", "0");
      })
      .union(function () {
        this.select(
          ParamSuspensao.raw("'Super Comercial' AS tipo"),
          "gerev as valor",
          "tipoSuspensao",
          "validade"
        )
        .where("gerev", "!=", "0");
      })
      .union(function () {
        this.select(
          ParamSuspensao.raw("'Prefixo' AS tipo"),
          "prefixo as valor",
          "tipoSuspensao",
          "validade"
        )
        .where("prefixo", "!=", "0");
      })
      .union(function () {
        this.select(
          ParamSuspensao.raw("'Matricula' AS tipo"),
          "matricula as valor",
          "tipoSuspensao",
          "validade"
        )
        .where("matricula", "!=", "0");
      })
      .fetch();

    return suspensaoData;
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
