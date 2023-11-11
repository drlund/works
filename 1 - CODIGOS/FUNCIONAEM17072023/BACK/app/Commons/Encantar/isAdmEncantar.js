
const hasPermission = use("App/Commons/HasPermission");

/**
 *
 * Documente sua função!!!
 *
 */

const isAdmEncantar = async (usuarioLogado) => {
  const possuiAcesso = await hasPermission({
    nomeFerramenta: "Encantar",
    dadosUsuario: usuarioLogado,
    permissoesRequeridas: ["ADM_ENCANTAR"],
    verificarTodas: true,
  });

  return possuiAcesso;
};

module.exports = isAdmEncantar;
