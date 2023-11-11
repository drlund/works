/**
 * Na versão 4.1 do AdonisJS, não há um método `raw` diretamente no modelo. Para realizar a concatenação no AdonisJS 4.1, 
 * podemos utilizar a função `knex.raw()` diretamente, pois o AdonisJS utiliza o Knex.js como query builder.
 * 
 * Aqui está o código corrigido para realizar a concatenação usando `knex.raw()`:
*/


"use strict";

const Database = use("Database");
const ParamSuspensao = use("App/Models/Mysql/movimentacoes/ParamSuspensao");

class ParametroSuspensaoRepository {
  async getSuspensoes() {
    const suspensaoData = await Database.table("suspensaoIndicacao")
      .select(
        Database.raw(
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

/**
 * Nesta correção, utilizamos `Database.table("suspensaoIndicacao")` para realizar a consulta e, em seguida, 
 * utilizamos `Database.raw()` para realizar a concatenação dos campos "diretoria", "super", "gerev", "prefixo" 
 * e "matricula" em uma única coluna com o nome "TIPO". Isso deve resolver o erro e permitir que você obtenha 
 * os dados no formato desejado para o seu DataTable no frontend.
 */