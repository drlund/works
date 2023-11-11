"use strict";
const GestoresModel = use("App/Models/Mysql/FlexCriterios/Gestores");

/**
 *Função que verifica se funcionário tem perfil funcionario analista
 */

const verificarPermissaoAnalista = async (usuarioLogado) => {
  let usuarioAnalista = false;

  const gestores = await GestoresModel.query()
    .select("uor", "despachoGerencial")
    .fetch();
  const gestoresToJSON = gestores?.toJSON() ?? null;

  if (gestoresToJSON) {
    gestoresToJSON.forEach((a) => {
      if (a.uor == usuarioLogado.uor_trabalho) {
        usuarioAnalista = true;
      }
    });
  }

  return usuarioAnalista;
};

module.exports = verificarPermissaoAnalista;
