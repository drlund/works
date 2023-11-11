"use strict";
const Projeto = use("App/Models/Mysql/Projetos/Projeto.js");

const getProjetoWith = async (idProjeto, trx = null) => {
  let queryProjeto = Projeto.query()
    .where({ id: idProjeto, ativo: "true" })
    .with("responsavel", (builder) => {
      // adiciona os campos extras da tabela pivot
      builder
        .withPivot(
          ["administrador", "dev", "dba", "ativo"],
          "app_projetos.projetos_responsaveis"
        )
        .where("ativo", "true");
    })
    .with("funcionalidade", (builder) => {
      // adiciona os responsáveis pelas funcionalidades
      builder
        .with("responsavel", (builder2) => {
          // adiciona os campos extras da tabela pivot
          builder2
            .withPivot(
              ["principal", "ativo"],
              "app_projetos.funcionalidades_responsaveis"
            )
            .where("ativo", "true");
        })
        .where("ativo", "true");
    })
    .with("anexo", (builder) => {
      builder.where("ativo", "true");
    })
    .with("timeline")
    .with("atividade", (builder) => {
      builder
        .with("responsavel", (builder2) => {
          builder2
            .withPivot(["ativo"], "app_projetos.atividades_responsaveis")
            .where("ativo", "true");
        })
        .with("status")
        .with("complexidade")
        .with("prioridade")
        .with("pausa")
        .where("ativo", "true");
    })
    .with("conhecimento")
    .with("esclarecimento", (builder) => {
      builder
        .with("nomePedido")
        .with("nomeIndicadoResponder")
        .with("nomeResposta")
        .where("ativo", "true");
    })
    .with("problema")
    .with("status");
  let projeto;
  if (trx) {
    projeto = await queryProjeto.transacting(trx).first();
    console.log("consulta projeto com trx");
  } else {
    projeto = await queryProjeto.first();
    console.log("consulta projeto sem trx");
  }
  return projeto;
}

const getProjetoFind = (id) => {
  const projeto = await Projeto.find(id);

  return projeto;
}

const getProjetosToLista = async () => {
  let projeto = await Projeto.query()
    .with("responsavel", (builder) => {
      builder
        .withPivot(["administrador", "dev", "dba", "ativo"])
        .where("app_projetos.projetos_responsaveis.ativo", "true");
    })
    .with("status")
    .where("ativo", "true")
    .fetch();

  return projeto;
}

module.exports = {
  getProjetoWith,
  getProjetoFind,
  getProjetosToLista,
}