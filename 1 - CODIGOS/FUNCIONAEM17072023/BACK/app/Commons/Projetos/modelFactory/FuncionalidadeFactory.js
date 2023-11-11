"use strict";
const Funcionalidade = use("App/Models/Mysql/Projetos/Funcionalidade.js");

const funcionalidadeFactory = async (funcionalidade, projeto) => {
  const funcionalidadeFactory = new Funcionalidade();
  funcionalidadeFactory.idProjeto = projeto.id;
  funcionalidadeFactory.idStatus = funcionalidade.idStatus;
  funcionalidadeFactory.idTipo = funcionalidade.idTipo;
  funcionalidadeFactory.idFuncionalidadeReferencia = funcionalidade.idFuncionalidadeReferencia;
  funcionalidadeFactory.titulo = funcionalidade.titulo;
  funcionalidadeFactory.descricao = funcionalidade.descricao;
  funcionalidadeFactory.detalhe = funcionalidade.detalhe;

  return funcionalidadeFactory;
}

module.exports = funcionalidadeFactory;