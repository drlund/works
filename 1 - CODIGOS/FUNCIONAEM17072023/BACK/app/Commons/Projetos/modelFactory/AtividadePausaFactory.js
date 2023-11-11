"use strict";
const AtividadePausa = use("App/Models/Mysql/Projetos/AtividadePausa.js");

const atividadePausaFactory = async (pausa) => {
  const pausaFactory = new AtividadePausa();
  pausaFactory.idAtividadePausada = pausa.idAtividadePausada;
  pausaFactory.idAtividadeGeradoraPausa = pausa.idAtividadeGeradoraPausa;
  pausaFactory.titulo = pausa.titulo;
  pausaFactory.descricao = pausa.descricao;
  pausaFactory.prazo = pausa.prazo;
  // pausaFactory.dtInicio = pausa.dtInicio;
  // pausaFactory.dtConclusao = pausa.dtConclusao;

  return pausaFactory;
}

module.exports = atividadePausaFactory;