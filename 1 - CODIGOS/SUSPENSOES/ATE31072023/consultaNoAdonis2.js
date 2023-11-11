/**
 * Pode-se usar o método `whereNotNull()` para garantir que os valores das colunas não sejam nulos. Isso deve incluir os registros com valores não nulos, além dos 
 * que são diferentes de zero.
 * 
 * Se você está recebendo um array vazio mesmo quando existem valores nas colunas `vicePresi`, `super`, `prefixo` e `matricula`, isso pode acontecer por algumas razões:
 * 
 * 1. Os valores presentes nessas colunas não são exatamente iguais a zero, mas podem ser nulos (null) ou vazios (empty). A consulta está filtrando apenas os valores 
 * diferentes de zero (0), o que não incluiria nulos ou vazios.
 * 
 * 2. Pode haver algum erro na conexão com o banco de dados ou na configuração do modelo `ParamSuspensao`.
 * 
 * Para verificar a primeira possibilidade, você pode modificar as cláusulas `where()` para incluir também a verificação de nulos ou vazios, conforme mostrado abaixo:
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
      .whereNotNull("vicePresi")
      .whereNotNull("diretoria")
      .whereNotNull("super")
      .whereNotNull("gerev")
      .whereNotNull("prefixo")
      .whereNotNull("matricula")
      .fetch();

    const busca = paramSuspensao ? paramSuspensao.toJSON() : [];

    return busca;
  }
}
