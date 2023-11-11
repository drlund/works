const exception = use('App/Exceptions/Handler');
const DipesSas = use("App/Models/Mysql/DipesSas");
const _ = require('lodash');

//Private methods
async function getTreinamentosFunci(funci) {

  let treinamentos = await DipesSas.query()
    .select("cod_curso")
    .from("arhp9050_treinamentosrealizados")
    .where("matricula", funci)
    .fetch();

  if (!treinamentos) {

    throw new exception("Dados dos treinamentos do funcionário não encontrados.", 404);
  }

  return treinamentos.toJSON();

}

module.exports = getTreinamentosFunci;
