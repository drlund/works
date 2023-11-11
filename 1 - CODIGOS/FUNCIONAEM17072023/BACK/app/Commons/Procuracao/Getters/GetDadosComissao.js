"use strict";
const DadosComissao = use("App/Models/Mysql/Procuracao/DadosComissao.js");

const getComissaoByCodigo = async (codigoCargo) => {
  let comissao = await DadosComissao.query()
    .where("codigoCargo", codigoCargo)
    .where("ativo", 1)
    .first();

  if (comissao) comissao = comissao.toJSON();
  return comissao;
}

module.exports = getComissaoByCodigo;