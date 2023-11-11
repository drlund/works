const jurisdicaoModel = use('App/Models/Mysql/Jurisdicao');

const strategy = {
  subordinadas: (prefixo, query) => {
    query.where("prefixo", prefixo);
    return query
      .clone()
      .orderBy("nivel", "asc")
      .orderBy("nome_subordinada", "asc");
  },

  subordinantes: (prefixo, query) => {
    query.where("prefixo_subordinada", prefixo);
    return query.clone().orderBy("nivel", "asc").orderBy("nome", "asc");
  },
};



/**
 *
 *
 *  Função que traz a hierarquia completa de um prefixo, com todos os seus subordinados e subordinantes
 *
 *  @param {String} prefixo
 *  @return {Hierarquia}
 *
 */

const getHierarquiaDependencia = async (prefixo) => {
  const commonQuery = jurisdicaoModel
    .query()
    .where("cd_subord_subordinada", "00")
    .where("cd_subord", "00");

  const tiposHierarquia = {
    subordinadas: [],
    subordinantes: [],
  };

  for (const tipo in tiposHierarquia) {
    tiposHierarquia[tipo] = await strategy[tipo](
      prefixo,
      commonQuery.clone()
    ).fetch();
  }

  return {
    prefixo,
    subordinadas: tiposHierarquia.subordinadas.toJSON(),
    subordinantes: tiposHierarquia.subordinantes.toJSON(),
  };
};

module.exports = getHierarquiaDependencia;
