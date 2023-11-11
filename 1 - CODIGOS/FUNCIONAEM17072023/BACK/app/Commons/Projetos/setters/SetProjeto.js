"use strict";
const { getProjeto } = use("../CatalogoMetodosGetters");
const { projetoFactory } = use("../CatalogoMetodosModelFactory");

const setProjetoNovo = async (informacaoBasica, usuario, trx) => {
  const projetoData = await projetoFactory(
    informacaoBasica,
    usuario
  );

  return await _setProjeto(projetoData, trx);
}

const setProjetoExistente = async (informacaoBasica, idProjeto, trx = null) => {
  const projetoData = await getProjeto.getProjetoFind(idProjeto);
  console.log("buscou o projeto");

  projetoData.titulo = informacaoBasica.titulo;
  projetoData.resumo = informacaoBasica.resumo;
  projetoData.objetivo = informacaoBasica.objetivo;
  projetoData.qtdePessoas = informacaoBasica.qtdePessoas;
  projetoData.reducaoTempo = informacaoBasica.reducaoTempo;
  projetoData.reducaoCusto = informacaoBasica.reducaoCusto;
  projetoData.idStatus = informacaoBasica.idStatus;

  return await _setProjeto(projetoData, trx);
}

// const updateProjetoStatus = async (idProjeto, novoStatus, trx = null) => {
//   let projetoData = await getProjeto.getProjetoToModel(idProjeto);
//   projetoData.idStatus = novoStatus;
//   return await _setProjeto(projetoData, trx)
// }

const _setProjeto = async (projetoData, trx = null) => {
  let gravarProjeto;
  if (trx) {
    gravarProjeto = await projetoData.save(trx);
  } else {
    gravarProjeto = await projetoData.save();
  }
  if (gravarProjeto.isNew) {
    throw new exception("Falha ao gravar os dados básicos do projeto.", 400);
  }

  return gravarProjeto;
}

module.exports = {
  setProjetoNovo,
  setProjetoExistente,
  // updateProjetoStatus,
}
