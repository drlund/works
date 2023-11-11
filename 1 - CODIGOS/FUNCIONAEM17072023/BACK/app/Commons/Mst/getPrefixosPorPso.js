const mestreSasModel = use("App/Models/Mysql/MestreSas");

const getPrefixosPorPso = async (prefixoPSO) => {
  const prefixosAtendidos = await mestreSasModel
    .query()
    .table("mst606_full")
    .select("prefixo")
    .where("prefixo_pso", prefixoPSO)
    .fetch();

  return prefixosAtendidos.toJSON().map((prefixo) => {
    return prefixo.prefixo;
  });
};

module.exports = getPrefixosPorPso;
