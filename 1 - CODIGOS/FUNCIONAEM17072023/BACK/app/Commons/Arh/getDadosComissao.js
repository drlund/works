const exception = use('App/Exceptions/Handler');
const Dipes = use("App/Models/Mysql/Dipes");
const _ = require('lodash');

async function getDadosComissao(comissao) {
  const dados = await Dipes.query()
    .from("arhfot05")
    .where("cod_comissao", comissao)
    .first();

  if (!dados) {
    throw new exception("Dados da comissão não encontrados.", 404);
  }

  return (dados.toJSON());
}

module.exports = getDadosComissao;