"use strict";

const isAdmin = use("App/Commons/Arh/isAdmin");

/**
 *Função que verifica se funcionário tem perfil solicitante
 */

const verificarPermissaoSolicitante = async (usuarioLogado) => {
  let funciPerfilSolicitante = false;

  const primeiroGestor = await isAdmin(
    usuarioLogado.matricula,
    usuarioLogado.cod_funcao
  );

  if (primeiroGestor) {
    funciPerfilSolicitante = true;
  }
  if (!primeiroGestor) {
    //TODO: funci plat, ou consultor super comercial (solicitante) funciPerfilSolicitante=true
  }

  return funciPerfilSolicitante;
};

module.exports = verificarPermissaoSolicitante;
