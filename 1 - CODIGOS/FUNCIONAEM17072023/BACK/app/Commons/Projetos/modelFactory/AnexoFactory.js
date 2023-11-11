"use strict";
const Anexo = use("App/Models/Mysql/Projetos/Anexo.js");

// async function anexoFactory (anexo, projeto) {
const anexoFactory = async (anexo, projeto) => {
  const anexoFactory = new Anexo();
  anexoFactory.idProjeto = projeto.id;
  anexoFactory.nome = anexo.nome;
  anexoFactory.nomeOriginal = anexo.nomeOriginal;
  anexoFactory.extensao = anexo.extensao;
  anexoFactory.path = anexo.path;

  return anexoFactory;
}

module.exports = anexoFactory;