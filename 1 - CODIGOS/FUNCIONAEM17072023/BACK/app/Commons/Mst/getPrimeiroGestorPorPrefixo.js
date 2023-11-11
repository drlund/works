const primeiroGestorModel = use("App/Models/Mysql/PrimeiroGestor");

/**
 *
 *  Documente a sua função !!!!
 *
 */

const getPrimeiroGestorPorPrefixo = async (prefixo) => {
  const primeiroGestor = await primeiroGestorModel
    .query()
    .where("prefixo", prefixo)
    .with("dadosFunci")
    .first();

  return primeiroGestor.toJSON().dadosFunci;
};

module.exports = getPrimeiroGestorPorPrefixo;
