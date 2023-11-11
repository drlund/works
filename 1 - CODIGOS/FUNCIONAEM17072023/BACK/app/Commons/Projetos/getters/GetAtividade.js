"use strict";
"use strict";
const Atividade = use("App/Models/Mysql/Projetos/Atividade.js");

const getAtividadeWith = async (idAtividade, trx = null) => {
  let queryAtividade = Atividade.query()
    .where("id", idAtividade)
    .where("ativo", "true")
    .with("projeto")
    .with("responsavel", (builder) => {
      builder.withPivot(["ativo"]).where("ativo", "true");
    })
    .with("prioridade")
    .with("complexidade")
    .with("grupo")
    .with("status")
    .with("tipo")
    .with("esclarecimento")
    .with("pausa");
  let atividade;
  if (trx) {
    atividade = await queryAtividade.transacting(trx).first();
    console.log("pega atividade com trx");
  } else {
    atividade = await queryAtividade.first();
    console.log("pega atividade");
  }

  return atividade;
}

const getAtividadeFind = (id) => {
  const atividade = await Atividade.find(id);

  return atividade;
}

module.exports = {
  getAtividadeWith,
  getAtividadeFind,
}