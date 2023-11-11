/**
 * No AdonisJS 4.1, o método `raw` é usado para construir consultas usando o Query Builder (Knex.js), mas 
 * não diretamente em um modelo.
 * 
 * Para realizar a concatenação dos campos e refletir a consulta da view na sua repository, podemos usar o 
 * método `select` do modelo `ParamSuspensao` diretamente.
 * 
 * Aqui está o código corrigido:
*/


"use strict";

const ParamSuspensao = use("App/Models/Mysql/movimentacoes/ParamSuspensao");

class ParametroSuspensaoRepository {
  async getSuspensoes() {
    const suspensaoData = await ParamSuspensao.query()
      .select(
        ParamSuspensao.db.raw(
          "CONCAT(diretoria, super, gerev, prefixo, matricula) as tipo"
        ),
        "vicePresi as valor",
        "tipoSuspensao",
        "validade"
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
      .unionAll(function () {
        this.select(
          ParamSuspensao.db.raw("'Unidade Estratégica' as tipo"),
          "diretoria as valor",
          "tipoSuspensao",
          "validade"
        )
          .from("suspensaoIndicacao")
          .where("diretoria", "!=", "0");
      })
      .unionAll(function () {
        this.select(
          ParamSuspensao.db.raw("'Unidade Tática' as tipo"),
          "super as valor",
          "tipoSuspensao",
          "validade"
        )
          .from("suspensaoIndicacao")
          .where("super", "!=", "0");
      })
      .unionAll(function () {
        this.select(
          ParamSuspensao.db.raw("'Super Comercial' as tipo"),
          "gerev as valor",
          "tipoSuspensao",
          "validade"
        )
          .from("suspensaoIndicacao")
          .where("gerev", "!=", "0");
      })
      .unionAll(function () {
        this.select(
          ParamSuspensao.db.raw("'Prefixo' as tipo"),
          "prefixo as valor",
          "tipoSuspensao",
          "validade"
        )
          .from("suspensaoIndicacao")
          .where("prefixo", "!=", "0");
      })
      .unionAll(function () {
        this.select(
          ParamSuspensao.db.raw("'Matricula' as tipo"),
          "matricula as valor",
          "tipoSuspensao",
          "validade"
        )
          .from("suspensaoIndicacao")
          .where("matricula", "!=", "0");
      });

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