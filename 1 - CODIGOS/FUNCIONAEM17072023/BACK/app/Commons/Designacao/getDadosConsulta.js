const exception = use("App/Exceptions/Handler");
const FunciAdm = use("App/Models/Mysql/FunciAdm");
const MestreSas = use("App/Models/Mysql/MestreSas");
const getDepESubord = use("App/Commons/Designacao/getDepESubord");
const {getDadosComissaoCompleto} = use("App/Commons/Arh");

const getDadosConsulta = async (user) => {
  try {
    let funciAdm = await FunciAdm.query()
        .where("matricula", user.chave)
        .first();

    funciAdm = funciAdm.toJSON();

    /**
     * neste local, caso o funcionário seja superintendente regional, atualmente as consultas abaixo
     * retornam apenas os prefixos abaixo da própria regional.
     * Modificar para retornar todos os prefixos da superintendencia
     */

    let uor_trabalho = await MestreSas.query()
      .table("vinculo_gerev")
      .where("uor_trabalho", user.uor)
      .first();

    if (uor_trabalho) {
      if (!_.isEmpty(uor_trabalho)) {
        user.uor_regional = funciAdm.cod_uor_trabalho = uor_trabalho.uor_gerev;
        user.pref_regional = uor_trabalho.prefixo_gerev;
      }
    }

    let prefixos = await getDepESubord(user);

    const nivelGer = await getDadosComissaoCompleto(user.cod_funcao);

    return {funciAdm, user, prefixos, nivelGer};

  } catch (err) {
    throw new exception(err, 404);
  }
}

module.exports = getDadosConsulta;