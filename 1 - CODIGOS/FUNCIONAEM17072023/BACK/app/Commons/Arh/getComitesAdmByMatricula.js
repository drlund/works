const { getListaComitesByMatricula } = use("App/Commons/Arh/dadosComites");
const prefixoIntToString = use("App/Commons/prefixoIntToString")
/**
 *
 *    Retorna array de prefixos nos quais a matricula é membro do comitê de administração
 *
 */

const getComitesAdmByMatricula = async (matricula) => {
  const comitesAdministracao = await getListaComitesByMatricula(matricula);
  const prefixosComitesAdministracao = comitesAdministracao.map((comite) =>
    prefixoIntToString(comite.PREFIXO)
  );

  return prefixosComitesAdministracao;
};

module.exports = getComitesAdmByMatricula;
