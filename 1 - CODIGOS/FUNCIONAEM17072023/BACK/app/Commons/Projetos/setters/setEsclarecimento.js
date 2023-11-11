"use strict";
const { esclarecimentoFactory } = use("../CatalogoMetodosModelFactory");
const { getEsclarecimento } = use("../CatalogoMetodosGetters");

const setEsclarecimentoNovo = (idAtividade, idEsclarecimento, idFuncionalidade, idProjeto, matriculaIndicadoResponder, pedido, isObservacao, usuario) => {
  const esclarecimentoData = await esclarecimentoFactory(
    {
      idAtividade,
      idEsclarecimento,
      idFuncionalidade,
      idProjeto,
      matriculaIndicadoResponder,
      pedido,
      isObservacao,
    },
    usuario
  );

  return await _setEsclarecimento(esclarecimentoData);
}

const setEsclarecimentoExistente = (id, resposta, ativo, usuario) => {
  const esclarecimentoData = await getEsclarecimento.getEsclarecimentoFind(id);
  if (resposta) {
    esclarecimentoData.resposta = resposta;
    esclarecimentoData.matriculaResposta = usuario.chave;
    esclarecimentoData.ativo = ativo;
  } else {
    esclarecimentoData.ativo = ativo;
  }

  return await _setEsclarecimento(esclarecimentoData);
}

const _setEsclarecimento = (esclarecimentoData) => {
  let gravarEsclarecimento = await esclarecimentoData.save();
  if (gravarEsclarecimento.isNew) {
    throw new exception(
      "Falha ao gravar os esclarecimentos/observações do projeto.",
      400
    );
  }

  return gravarEsclarecimento;
}

module.exports = {
  setEsclarecimentoNovo,
  setEsclarecimentoExistente,
}