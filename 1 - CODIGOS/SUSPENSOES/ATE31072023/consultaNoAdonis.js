/**
 * A consulta apresentada no código é escrita em Node.js usando o framework Adonis.js, presumindo que `ParamSuspensao` é um modelo do banco de dados. 
 * A consulta tem o objetivo de recuperar registros distintos da tabela `param_suspensao` com base em algumas colunas específicas, enquanto aplica 
 * filtros para excluir registros com valores iguais a zero nas colunas `vicePresi`, `diretoria`, `super`, `gerev`, `prefixo`, e `matricula`. 
 * 
 * A consulta utiliza o método `distinct()` para obter valores únicos em cada coluna e o método `where()` para aplicar as condições de filtragem. 
 * 
 * No entanto, há um erro na consulta, onde a cláusula `.where("super", "!=", 0)` é repetida duas vezes. Isso provavelmente foi um erro de digitação, 
 * e a segunda cláusula deve se referir a outra coluna.
 * 
 * Aqui está a consulta corrigida:
*/

class ParametroSuspensaoRepository {
  async getSuspensoes() {
    const paramSuspensao = await ParamSuspensao.query()
      .distinct("vicePresi")
      .distinct("diretoria")
      .distinct("super")
      .distinct("gerev")
      .distinct("prefixo")
      .distinct("matricula")
      .distinct("tipoSuspensao")
      .distinct("validade")
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
