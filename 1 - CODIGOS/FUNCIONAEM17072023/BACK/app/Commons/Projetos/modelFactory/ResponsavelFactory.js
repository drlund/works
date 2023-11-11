"use strict";
const Responsavel = use("App/Models/Mysql/Projetos/Responsavel.js");

const responsavelFactory = async (responsavel) => {
  const funci = await getOneFunci(responsavel.matricula);
  const responsavelFactory = new Responsavel();
  responsavelFactory.matricula = funci.matricula;
  responsavelFactory.nome = funci.nome;

  return responsavelFactory;
}

module.exports = responsavelFactory;