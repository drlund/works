"use strict";
const OperacionalGestorModel = use(
  "App/Models/Mysql/FlexCriterios/OperacionalGestor"
);

/**
 *Função que verifica se funcionário é membro executante de gestor cadastrado na tabela OperacionalGestor.
 */

const verificarPermissaoExecutante = async (usuarioLogado) => {
  let usuarioExecutante = false;

  const uorGestor = await OperacionalGestorModel.query().select("uor").fetch();

  const uorGestorToJSON = uorGestor?.toJSON() ?? null;

  if (uorGestorToJSON) {
    uorGestorToJSON.forEach((a) => {
      if (a.uor == usuarioLogado.uor_trabalho || a.uor == usuarioLogado.uor) {
        usuarioExecutante = true;
      }
    });
  }

  return usuarioExecutante;
};

module.exports = verificarPermissaoExecutante;
