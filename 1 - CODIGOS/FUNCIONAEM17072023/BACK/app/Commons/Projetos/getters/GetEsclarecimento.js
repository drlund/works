"use strict";
const Esclarecimento = use("App/Models/Mysql/Projetos/Esclarecimento.js");

const getEsclarecimentoFind = async (id) => {
  const esclarecimento = await Esclarecimento.find(id);

  return esclarecimento;
}

module.exports = {
  getEsclarecimentoFind,
}