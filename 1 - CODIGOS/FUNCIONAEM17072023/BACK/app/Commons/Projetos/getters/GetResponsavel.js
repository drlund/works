"use strict";
const Responsavel = use("App/Models/Mysql/Projetos/Responsavel.js");

const getResponsavelWith = async (matricula, trx = null) => {
  let queryResponsavel = Responsavel.query()
    .where("matricula", matricula)
    .with("projeto.responsavel")
    .with("projeto.status")
    .with("projeto", (builder) => {
      builder.withPivot(["administrador", "dev", "dba", "ativo"]).where({
        "app_projetos.projetos_responsaveis.ativo": "true",
        "app_projetos.projetos.ativo": "true",
      });
    })
    .with("funcionalidade", (builder) => {
      builder
        .withPivot(["principal", "ativo"])
        .where("app_projetos.funcionalidades_responsaveis.ativo", "true")
        .where("app_projetos.funcionalidades.ativo", "true");
    })
    .with("atividade", (builder) => {
      builder
        .withPivot(["ativo"])
        .where("app_projetos.atividades_responsaveis.ativo", "true")
        .where("app_projetos.atividades.ativo", "true");
    });
  let responsavel;
  if (trx) {
    responsavel = await queryResponsavel.transacting(trx).first();
  } else {
    responsavel = await queryResponsavel.first();
  }

  return responsavel;
}

const getResponsavelFind = async (id) => {
  const responsavel = await Responsavel.find(id);

  return responsavel;
}

module.exports = {
  getResponsavelWith,
  getResponsavelFind,
}