"use strict";
const Funcionalidade = use("App/Models/Mysql/Projetos/Funcionalidade.js");

const getFuncionalidadeWith = async (idFuncionalidade, trx) => {
  let queryFuncionalidade = Funcionalidade.query()
    .where("id", idFuncionalidade)
    .where("ativo", "true")
    .with("projeto")
    .with("responsavel", (builder) => {
      builder.withPivot(["principal", "ativo"]).where("ativo", "true");
    })
    .with("status")
    .with("tipo");
  // .with('esclarecimento')
  let funcionalidade;
  if (trx) {
    funcionalidade = await queryFuncionalidade.transacting(trx).first();
    console.log("busca funcionalidade com trx");
  } else {
    funcionalidade = await queryFuncionalidade.first();
    console.log("busca funcionalidade");
  }

  return funcionalidade;
}

const getFuncionalidadeFind = async (id) => {
  const funcionalidade = await Funcionalidade.find(id);

  return funcionalidade;
}

module.exports = {
  getFuncionalidadeWith,
  getFuncionalidadeFind,
}