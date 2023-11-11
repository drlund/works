"use strict";
const GestoresModel = use("App/Models/Mysql/FlexCriterios/Gestores");
const isComissaoNivelGerencial = use(
  "App/Commons/Arh/isComissaoNivelGerencial"
);

/**
 *Função que verifica se funcionário tem perfil despachante
 */

const verificarPermissaoDespachante = async (usuarioLogado) => {
  let usuarioDespachante = false;

  const gestores = await GestoresModel.query()
    .select("uor", "despachoGerencial")
    .where("uor", usuarioLogado.uor_trabalho)
    .first();
  const gestoresToJSON = gestores?.toJSON() ?? null;

  if (gestoresToJSON?.despachoGerencial == "0") {
    usuarioDespachante = true;
  }

  return usuarioDespachante;
};

module.exports = verificarPermissaoDespachante;
