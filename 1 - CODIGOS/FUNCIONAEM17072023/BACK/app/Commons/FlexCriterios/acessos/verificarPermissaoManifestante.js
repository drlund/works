"use strict";
const isAdmin = use("App/Commons/Arh/isAdmin");
const ManifestacoesModel = use("App/Models/Mysql/FlexCriterios/Manifestacoes");

/**
 *Função que verifica se funcionário tem perfil manifestante
 */

const verificarPermissaoManifestante = async (usuarioLogado) => {
  let funciPerfilManifestante = false;

  //essa permissao injeta o papel manifestante pros deferidos e zua a aplicação
  /*  const jaSeManifestouAlgumDia = await ManifestacoesModel.query()
    .where({
      matricula: usuarioLogado.matricula,
    })
    .whereIn("prefixo", [usuarioLogado.prefixo])
    .first(); */

  const primeiroGestor = await isAdmin(
    usuarioLogado.matricula,
    usuarioLogado.cod_funcao
  );

  if (primeiroGestor /* || jaSeManifestouAlgumDia */) {
    funciPerfilManifestante = true;
  }

  return funciPerfilManifestante;
};

module.exports = verificarPermissaoManifestante;
