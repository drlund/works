"use strict";
const Anexo = use("App/Models/Mysql/Projetos/Anexo.js");

const getAnexoWhere = async (idProjeto, nome) => {
  const anexo = await Anexo.query()
    .where("idProjeto", idProjeto)
    .where("nome", nome)
    .where("ativo", "true")
    .first();

  return anexo;
}

const getAnexoFind = async (id) => {
  const anexo = await Anexo.find(id);

  return anexo;
}

module.exports = {
  getAnexoWhere,
  getAnexoFind,
}