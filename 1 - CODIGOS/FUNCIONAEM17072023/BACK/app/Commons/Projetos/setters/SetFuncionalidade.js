"use strict";
const { funcionalidadeFactory } = use("../CatalogoMetodosModelFactory");
const { getFuncionalidade } = use("../CatalogoMetodosGetters");

const setFuncionalidadeNova = async ( funcionalidade, projetoData, trx = null ) => {
  const funcionalidadeData = await funcionalidadeFactory(
    funcionalidade,
    projetoData
  );
  console.log("criou nova funcionalidade");
  await _setFuncionalidade(funcionalidadeData, trx);
  funcionalidadeData.idAnterior = funcionalidade.id;

  return funcionalidadeData;
}

const setFuncionalidadeExistente = async (funcionalidade, trx = null) => {
  const funcionalidadeData = await getFuncionalidade.getFuncionalidadeFind(funcionalidade.id);
  // atualiza os inputs da funcionalidade
  funcionalidadeData.titulo = funcionalidade.titulo;
  funcionalidadeData.descricao = funcionalidade.descricao;
  funcionalidadeData.detalhe = funcionalidade.detalhe;
  funcionalidadeData.ativo = funcionalidade.ativo;
  await _setFuncionalidade(funcionalidadeData, trx);
  funcionalidadeData.idAnterior = funcionalidade.id;

  return funcionalidadeData;
}

const _setFuncionalidade = async (funcionalidadeData, trx = null) => {
  let gravarFuncionalidade;
  if (trx) {
    gravarFuncionalidade = await funcionalidadeData.save(trx);
  } else {
    gravarFuncionalidade = await funcionalidadeData.save();
  }
  if (gravarFuncionalidade.isNew) {
    throw new exception(
      "Falha ao gravar a(s) funcionalidade(s) do projeto.",
      400
    );
  }

  return gravarFuncionalidade;
}

module.exports = {
  setFuncionalidadeNova,
  setFuncionalidadeExistente,
};
