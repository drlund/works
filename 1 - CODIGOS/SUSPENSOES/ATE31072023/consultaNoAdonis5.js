/**
 * Vamos fazer uma abordagem diferente para garantir que os valores iguais a zero sejam excluídos corretamente em cada consulta. 
 * 
 * Os resultados são retornados em um objeto contendo cada conjunto de resultados com as colunas "tipoSuspensao" e "validade" para 
 * cada item filtrado ("vicePresi", "diretoria", "super", "gerev", "prefixo" e "matricula").
 * 
 * Para encadear consultas separadas para cada item "vicePresi", "diretoria", "super", "gerev", "prefixo" e "matricula", você pode 
 * utilizar o método `where` para cada uma delas, como segue:
 */


class ParametroSuspensaoRepository {
  async getSuspensoes() {
    const paramSuspensao = await ParamSuspensao.query()
      .select("vicePresi")
      .distinct("tipoSuspensao")
      .distinct("validade")
      .where("vicePresi", "!=", 0)
      .fetch();

    const paramDiretoria = await ParamSuspensao.query()
      .select("diretoria")
      .distinct("tipoSuspensao")
      .distinct("validade")
      .where("diretoria", "!=", 0)
      .fetch();

    const paramSuper = await ParamSuspensao.query()
      .select("super")
      .distinct("tipoSuspensao")
      .distinct("validade")
      .where("super", "!=", 0)
      .fetch();

    const paramGerev = await ParamSuspensao.query()
      .select("gerev")
      .distinct("tipoSuspensao")
      .distinct("validade")
      .where("gerev", "!=", 0)
      .fetch();

    const paramPrefixo = await ParamSuspensao.query()
      .select("prefixo")
      .distinct("tipoSuspensao")
      .distinct("validade")
      .where("prefixo", "!=", 0)
      .fetch();

    const paramMatricula = await ParamSuspensao.query()
      .select("matricula")
      .distinct("tipoSuspensao")
      .distinct("validade")
      .where("matricula", "!=", 0)
      .fetch();

    const busca = {
      paramSuspensao: paramSuspensao ? paramSuspensao.toJSON() : [],
      paramDiretoria: paramDiretoria ? paramDiretoria.toJSON() : [],
      paramSuper: paramSuper ? paramSuper.toJSON() : [],
      paramGerev: paramGerev ? paramGerev.toJSON() : [],
      paramPrefixo: paramPrefixo ? paramPrefixo.toJSON() : [],
      paramMatricula: paramMatricula ? paramMatricula.toJSON() : [],
    };

    return busca;
  }
}
