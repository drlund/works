"use strict";
const Projeto = use("App/Models/Mysql/Projetos/Projeto.js");

const projetoFactory = async (informacaoBasica, usuario) => {
  const projetoFactory = new Projeto();
  projetoFactory.idStatus = informacaoBasica.idStatus;
  projetoFactory.matriculaSolicitante = usuario.chave;
  projetoFactory.prefixoSolicitante = usuario.prefixo;
  projetoFactory.uorSolicitante = usuario.uor_trabalho;
  projetoFactory.titulo = informacaoBasica.titulo;
  projetoFactory.resumo = informacaoBasica.resumo;
  projetoFactory.objetivo = informacaoBasica.objetivo;
  projetoFactory.qtdePessoas = informacaoBasica.qtdePessoas;
  projetoFactory.reducaoTempo = informacaoBasica.reducaoTempo;
  projetoFactory.reducaoCusto = informacaoBasica.reducaoCusto;

  return projetoFactory;
}

module.exports = projetoFactory;