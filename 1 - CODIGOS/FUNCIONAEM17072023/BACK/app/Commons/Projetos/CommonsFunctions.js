"use strict";
const md5 = use("md5");
const moment = use("App/Commons/MomentZoneBR");

const renomearArquivo = ( file ) => {
  const nome = md5(file.clientName + moment().format());
  return {
    name: `${nome}.${file.extname}`,
    overwrite: true,
  };
}

const isResponsavelDestaFuncionalidade = async (responsaveis, idFuncionalidade) => {
  // vincular os responsaveis e funcionalidades, gravar os dados na tabela pivot
  const lista = responsaveis
    .filter((responsavel) => {
      if (responsavel.funcionalidades.includes(idFuncionalidade))
        return responsavel;
    });
    // .map((resp) => resp);

  return lista;
}

module.exports = {
  renomearArquivo,
  isResponsavelDestaFuncionalidade,
}