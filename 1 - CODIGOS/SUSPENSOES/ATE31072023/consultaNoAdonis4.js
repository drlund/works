/**
 * Peço desculpas pela confusão causada pelas sugestões anteriores. O erro que você está enfrentando indica que o operador utilizado não 
 * está sendo reconhecido corretamente pelo Adonis.js. 
 * 
 * Para resolver esse problema, vamos utilizar uma abordagem diferente para a consulta, que deve ser compatível com o Adonis.js versão 4.1. 
 * Vamos utilizar a cláusula `where` e o operador lógico `orWhere` para garantir que os valores nas colunas sejam diferentes de zero.
 * 
 * Nesta abordagem, usamos o método `where` e uma função de callback para agrupar as cláusulas `where` com o operador `orWhere`. Isso deve 
 * resolver o problema com o operador "undefined".
 */


class ParametroSuspensaoRepository {
  async getSuspensoes() {
    const paramSuspensao = await ParamSuspensao.query()
      .select("vicePresi")
      .select("diretoria")
      .select("super")
      .select("gerev")
      .select("prefixo")
      .select("matricula")
      .select("tipoSuspensao")
      .select("validade")
      .where(function (query) {
        query.where("vicePresi", "!=", 0)
          .orWhere("diretoria", "!=", 0)
          .orWhere("super", "!=", 0)
          .orWhere("gerev", "!=", 0)
          .orWhere("prefixo", "!=", 0)
          .orWhere("matricula", "!=", 0);
      })
      .fetch();

    const busca = paramSuspensao ? paramSuspensao.toJSON() : [];

    return busca;
  }
}
