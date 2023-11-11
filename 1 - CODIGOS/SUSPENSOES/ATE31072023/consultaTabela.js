/**
 * Para obter os dados desejados no formato correto para o seu DataTable no frontend, você precisa fazer uma única consulta 
 * no banco de dados que retorna todos os campos necessários. Você deve modificar o método `getSuspensoes` para fazer isso.
 * 
 * Aqui estão as principais mudanças na consulta:
 * 
 * 1. Selecionamos os campos "vicePresi", "tipoSuspensao", "validade", "matriculaResponsavel" e "observacao" usando alias 
 * para adequá-los às colunas do DataTable.
 * 
 * 2. Usamos um único `where` com múltiplos `orWhere` para filtrar as linhas onde qualquer um dos campos "vicePresi", 
 * "diretoria", "super", "gerev", "prefixo" ou "matricula" tem um valor diferente de "0".
 * 
 * 3. Adicionamos a cláusula `with("tipoSuspensao")` para incluir os dados relacionados da tabela "tipoSuspensao", supondo 
 * que haja um relacionamento definido no modelo `ParamSuspensao`.
 * 
 * Dessa forma, o método da sua repository retornará um array de objetos, cada um representando uma linha da tabela, com 
 * os nomes de colunas desejados ("TIPO", "VALORES", "TIPOSUSPENSAO", "VALIDADE", "MATRICULARESPONSAVEL" e "OBSERVACAO").
 */

"use strict";

const ParamSuspensao = use("App/Models/Mysql/movimentacoes/ParamSuspensao");

class ParametroSuspensaoRepository {
  async getSuspensoes() {
    const suspensaoData = await ParamSuspensao.query()
      .select(
        "vicePresi as TIPO",
        "vicePresi as VALORES",
        "tipoSuspensao as TIPOSUSPENSAO",
        "validade as VALIDADE",
        "matriculaResponsavel as MATRICULARESPONSAVEL",
        "observacao as OBSERVACAO"
      )
      .where("vicePresi", "!=", "0")
      .orWhere("diretoria", "!=", "0")
      .orWhere("super", "!=", "0")
      .orWhere("gerev", "!=", "0")
      .orWhere("prefixo", "!=", "0")
      .orWhere("matricula", "!=", "0")
      .with("tipoSuspensao")
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
