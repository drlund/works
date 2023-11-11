"use strict";

/**
 *Função que verifica se funcionário é membro da INFOR e suas UOR'S.
 */

const verificarPermissaoRoot = async (usuarioLogado) => {
  /* const uorsInfor = ["000467585", "000459379", "000459304"]; */
  let usuarioRoot = false;

  /* uorsInfor.forEach((a) => {
    if (a == usuarioLogado.uor_trabalho) {
      usuarioRoot = true;
    }
  }); */

  return usuarioRoot;
};

module.exports = verificarPermissaoRoot;
