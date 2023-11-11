"use strict";
const Esclarecimento = use("App/Models/Mysql/Projetos/Esclarecimento.js");

const esclarecimentoFactory = async (esclarecimento, user) => {
  const esclarecimentoFactory = new Esclarecimento();
  esclarecimentoFactory.idProjeto = esclarecimento.idProjeto;
  esclarecimentoFactory.idEsclarecimento = esclarecimento.idEsclarecimento;
  esclarecimentoFactory.idFuncionalidade = esclarecimento.idFuncionalidade;
  esclarecimentoFactory.idAtividade = esclarecimento.idAtividade;
  esclarecimentoFactory.pedido = esclarecimento.pedido;
  esclarecimentoFactory.matriculaPedido = user.chave;
  esclarecimentoFactory.matriculaIndicadoResponder =
    esclarecimento.matriculaIndicadoResponder;
  esclarecimentoFactory.isObservacao = esclarecimento.isObservacao.toString();

  return esclarecimentoFactory;
}

module.exports = esclarecimentoFactory;