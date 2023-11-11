const dependenciaModel = use("App/Models/Mysql/Dependencia");

/**
 *
 *  Verifica se um determinado prefixo é, ou não, uma unidade de negócio.
 *  Essa checagem é feita verificando se a coluna tip_dep, da tabela mst606, é 35,13,8
 *
 *
 */

const tiposUnidadesNegociais = [35, 13, 18];

const checaUnidadeNegocio = async (prefixo) => {
  const dependenciaTipoDependencia = await dependenciaModel
    .query()
    .where("prefixo", prefixo)
    .first();
  return tiposUnidadesNegociais.includes(dependenciaTipoDependencia.tip_dep);
};

module.exports = checaUnidadeNegocio;
