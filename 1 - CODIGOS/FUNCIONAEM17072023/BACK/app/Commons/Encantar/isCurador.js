
const hasPermission = use("App/Commons/HasPermission");

/**
 *
 * Documente sua função!!!
 *
 */

const isCurador = async (usuarioLogado) => {
  const possuiAcesso = await hasPermission({
    nomeFerramenta: "Encantar",
    dadosUsuario: usuarioLogado,
    permissoesRequeridas: ["CURADOR"],
    verificarTodas: true,
  });

  return possuiAcesso;
};

module.exports = isCurador;