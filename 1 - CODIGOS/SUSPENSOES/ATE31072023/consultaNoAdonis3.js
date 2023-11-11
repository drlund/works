/**
 * Nesta consulta, usamos o método `select()` para especificar as colunas que queremos recuperar do banco de dados. Em seguida, aplicamos as cláusulas 
 * `where()` para filtrar os resultados para excluir as linhas com valores iguais a zero nas colunas `vicePresi`, `diretoria`, `super`, `gerev`, `prefixo` 
 * e `matricula`.
 * 
 * Se você precisa receber somente as colunas com os valores diferentes de zero e os respectivos valores, você pode usar uma abordagem diferente. Para 
 * isso, você pode usar o método `select()` em vez de `distinct()`, e em seguida, filtrar os resultados para remover as linhas com valores iguais a zero.
 * 
 * Aqui está como realizar a consulta correta para obter as colunas com valores diferentes de zero:
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
      .where("vicePresi", "!=", 0)
      .where("diretoria", "!=", 0)
      .where("super", "!=", 0)
      .where("gerev", "!=", 0)
      .where("prefixo", "!=", 0)
      .where("matricula", "!=", 0)
      .fetch();

    const busca = paramSuspensao ? paramSuspensao.toJSON() : [];

    return busca;
  }
}
