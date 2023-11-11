"use strict";
// inserir os responsáveis por projeto
const setPivotResponsavelProjeto = async (responsavelToTransact, idProjeto, trx) => {
  const gravarPivot = await responsavelToTransact.projeto().attach(
    // id do projeto
    [idProjeto],
    // callback marca a flag de administrador
    (linha) => {
      linha.administrador = responsavelToTransact.administrador.toString();
      linha.dev = responsavelToTransact.dev.toString();
      linha.dba = responsavelToTransact.dba.toString();
    },
    // incluir no transact
    trx
  );
  if (gravarPivot.isNew) {
    throw new exception(
      "Falha ao vincular o responsavel com o projeto.",
      400
    );
  }
}

// remover todos os responsáveis por projeto (impede a remoção de responsáveis de outros projetos)
const unsetPivotResponsaveisProjeto = async (projeto, listaResponsaveis, trx) => {
  const removerPivot = await projeto.responsavel().detach(
    // array de ids de responsaveis
    listaResponsaveis,
    // incluir no transact
    trx
  );
  if (removerPivot.isNew) {
    throw new exception(
      "Falha ao desvincular o responsavel com o projeto.",
      400
    );
  }
}

const  setPivotResponsavelFuncionalidade = async (responsavelToTransact, idFuncionalidade, responsavel, trx) => {
  const gravarPivot = await responsavelToTransact.funcionalidade().attach(
    // id da funcionalidade
    [idFuncionalidade],
    // callback marca a flag de principal contato
    (linha) => {
      let principal = "false";
      if (
        responsavel.principalNestasFuncionalidades.includes(idFuncionalidade)
      ) {
        principal = "true";
      }
      linha.principal = principal;
    },
    // incluir no transact
    trx
  );
  if (gravarPivot.isNew) {
    throw new exception(
      "Falha ao vincular o responsavel com a funcionalidade.",
      400
    );
  }
}

const unsetPivotResponsaveisFuncionalidade = async (funcionalidade, listaResponsaveis, trx) => {
  const removerPivot = await funcionalidade.responsavel().detach(
    // array de ids dos responsaveis
    listaResponsaveis,
    // incluir no transact
    trx
  );
  if (removerPivot.isNew) {
    throw new exception(
      "Falha ao desvincular os responsaveis com a funcionalidade.",
      400
    );
  }
}

const setPivotResponsavelAtividade = async (responsavelToTransact, idAtividade, trx) => {
  const gravarPivot = await responsavelToTransact.atividade().attach(
    // id da atividade
    [idAtividade],
    // callback para alterar outras colunas da tabela pivot
    null,
    // incluir no transact
    trx
  );
  if (gravarPivot.isNew) {
    throw new exception(
      "Falha ao vincular o responsavel com a atividade.",
      400
    );
  }
}

const unsetPivotResponsaveisAtividade = async (atividade, listaResponsaveis, trx) => {
  const removerPivot = await atividade.responsavel().detach(
    // array de ids dos responsaveis
    listaResponsaveis,
    // incluir no transact
    trx
  );
  if (removerPivot.isNew) {
    throw new exception(
      "Falha ao desvincular os responsaveis com a atividade.",
      400
    );
  }
}

module.exports = {
  setPivotResponsavelProjeto,
  unsetPivotResponsaveisProjeto,
  setPivotResponsavelFuncionalidade,
  unsetPivotResponsaveisFuncionalidade,
  setPivotResponsavelAtividade,
  unsetPivotResponsaveisAtividade,
}