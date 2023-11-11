"use strict";
const Atividade = use("App/Models/Mysql/Projetos/Atividade.js");
const {
  statusConcluido,
  statusEmAndamento,
  statusNaoIniciado,
} = use("App/Commons/projetos/Constantes");

const atividadeFactory = async (atividade, funcionalidade) => {
  const atividadeFactory = new Atividade();
  atividadeFactory.idProjeto = funcionalidade.idProjeto;
  atividadeFactory.idFuncionalidade = funcionalidade.id;
  atividadeFactory.idComplexidade = atividade.idComplexidade;
  atividadeFactory.idPrioridade = atividade.idPrioridade;
  if (!atividade.dtInicio) {
    // não iniciado
    atividadeFactory.idStatus = statusNaoIniciado;
  } else if (atividade.dtInicio && atividade.idStatus === statusNaoIniciado) {
    // em andamento
    atividadeFactory.idStatus = statusEmAndamento;
  } else if (atividade.dtConclusao) {
    // concluído
    atividadeFactory.idStatus = statusConcluido;
  } else {
    atividadeFactory.idStatus = atividade.idStatus;
  }
  atividadeFactory.idTipo = atividade.idTipo;
  atividadeFactory.titulo = atividade.titulo;
  atividadeFactory.descricao = atividade.descricao;
  atividadeFactory.dtInicio = atividade.dtInicio;
  atividadeFactory.dtConclusao = atividade.dtConclusao;
  atividadeFactory.prazo = atividade.prazo;

  return atividadeFactory;
}

module.exports = atividadeFactory;