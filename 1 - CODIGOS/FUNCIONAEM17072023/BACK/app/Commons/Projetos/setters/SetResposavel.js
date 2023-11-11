"use strict";
const { getResponsavel } = use("../CatalogoMetodosGetters");
const { responsavelFactory } = use("../CatalogoMetodosModelFactory");

const setResponsavelNovo = async (responsavelFromForm, trx = null) => {
  const responsavelData = await responsavelFactory(responsavelFromForm);
  await _setResponsavel(responsavelData, trx);
  responsavelData.idAnterior = responsavelFromForm.id;
  responsavelData.funcionalidades = responsavelFromForm.funcionalidades;
  responsavelData.principal = responsavelFromForm.principal;
  responsavelData.dev = responsavelFromForm.dev;
  responsavelData.dba = responsavelFromForm.dba;

  return responsavelData;
}

const setResponsavelExistente = async (responsavelFromDB, responsavelFromForm) => {
  responsavelFromDB.idAnterior = responsavelFromForm.id;
  responsavelFromDB.funcionalidades = responsavelFromForm.funcionalidades;
  responsavelFromDB.principal = responsavelFromForm.principal;
  responsavelFromDB.dev = responsavelFromForm.dev;
  responsavelFromDB.dba = responsavelFromForm.dba;

  return responsavelFromDB;
}

const _setResponsavel = (responsavelData, trx = null) => {
  let gravarResponsavel;
  if (trx) {
    gravarResponsavel = await responsavelData.save(trx);
  } else {
    gravarResponsavel = await responsavelData.save();
  }
  if (gravarResponsavel.isNew) {
    throw new exception("Falha ao atualizar o status do projeto.", 400);
  }

  return gravarResponsavel;
}

module.exports = {
  setResponsavelNovo,
  setResponsavelExistente,
};