"use strict";
const { atividadeFactory } = use("../CatalogoMetodosModelFactory");
const { getAtividade } = use("../CatalogoMetodosGetters");
const constantes = use("../Constantes");

const setAtividadeNova = async (atividade, funcionalidade, trx = null) => {
  const atividadeData = await atividadeFactory(atividade, funcionalidade);

  return await _setAtividade(atividadeData, trx);
};

const setAtividadeExistente = async (atividade, trx = null) => {
  const atividadeData = await getAtividade.getAtividadeFind(atividade.id);

  atividadeData.idFuncionalidade = atividade.idFuncionalidade;
  atividadeData.titulo = atividade.titulo;
  atividadeData.descricao = atividade.descricao;
  atividadeData.prazo = atividade.prazo;

  if (!atividadeData.dtInicio) atividadeData.dtInicio = atividade.dtInicio;

  if (!atividadeData.dtConclusao)
    atividadeData.dtConclusao = atividade.dtConclusao;
  atividadeData.idComplexidade = atividade.idComplexidade;
  atividadeData.idPrioridade = atividade.idPrioridade;

  if (!atividade.dtInicio) {
    // não iniciado
    atividadeData.idStatus = constantes.statusNaoIniciado;
  } else if (atividade.dtInicio && atividade.idStatus === constantes.statusNaoIniciado) {
    // em andamento
    atividadeData.idStatus = constantes.statusEmAndamento;
  } else if (atividade.dtConclusao) {
    // concluído
    atividadeData.idStatus = constantes.statusConcluido;
  } else {
    atividadeData.idStatus = atividade.idStatus;
  }

  atividadeData.idTipo = atividade.idTipo;

  return await _setAtividade(atividadeData, trx);
};

const _setAtividade = async (atividadeData, trx = null) => {
  let gravarAtividade;
  if (trx) {
    gravarAtividade = await atividadeData.save(trx);
  } else {
    gravarAtividade = await atividadeData.save();
  }
  if (gravarAtividade.isNew) {
    throw new exception("Falha ao gravar a(s) atividade(s) do projeto.", 400);
  }

  return gravarAtividade;
};

module.exports = {
  setAtividadeNova,
  setAtividadeExistente,
};
