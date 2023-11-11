const exception = use('App/Exceptions/Handler');

const _ = use('lodash');
const { executeDB2Query } = use('App/Models/DB2/DB2Utils');
const Solicitacao = use('App/Models/Mysql/Designacao/Solicitacao');
const { isAdmin, getOneDependencia, getDadosComissaoCompleto } = use('App/Commons/Arh');
const FunciAdm = use('App/Models/Mysql/FunciAdm');
const Funci = use('App/Models/Mysql/Arh/Funci');
const Superadm = use('App/Models/Mysql/Superadm');
const getDepESubord = use("./getDepESubord");
const getPrefixoMadrinha = use("./getPrefixoMadrinha");
const getDadosFunciOnline = use("./getDadosFunciOnline");


const { getListaComitesByMatricula } = use(
  "App/Commons/Arh/dadosComites"
);

async function getPerfilFunci(usuario) {

  try {
    let funciAdm = await FunciAdm.query()
      .where("matricula", usuario.chave)
      .first();

    /**
     * neste local, caso o funcionário seja superintendente regional, atualmente as consultas abaixo
     * retornam apenas os prefixos abaixo da própria regional.
     * Modificar para retornar todos os prefixos da superintendencia
     */

    let uor_trabalho = await Superadm.query()
      .table("vinculo_gerev")
      .where("uor_trabalho", usuario.uor)
      .first();

    if (uor_trabalho) {
      if (!_.isEmpty(uor_trabalho)) {
        usuario.uor_regional = funciAdm.cod_uor_trabalho = uor_trabalho.uor_gerev;
        usuario.pref_regional = uor_trabalho.prefixo_gerev;
      }
    }

    const { user, funciLogado, dadosComissaoFunciLogado } = await getDadosFunciOnline(usuario);

    const subordinadas = await getDepESubord(user);

    const listaComitesFunci = await getListaComitesByMatricula(user.chave);

    const comiteAdm = _.head(listaComitesFunci.filter(comite => comite.PREFIXO === parseInt(user.prefixo)));

    const funciIsAdmin = await isAdmin(funciLogado.matricula);

    return { user, funciLogado, comiteAdm, dadosComissaoFunciLogado, funciIsAdmin, subordinadas };
  } catch (err) {
    throw new exception(err, 400);
  }
}

module.exports = getPerfilFunci;