const exception = use('App/Exceptions/Handler');
const Dipes = use("App/Models/Mysql/Dipes");
const _ = require('lodash');
const Constantes = use("App/Templates/Designacao/Constantes");

async function isNomeacaoPendente(funci) {
  try {
    const nom = await Dipes.query()
      .select("data_posse")
      .from("tb_movimentacao_sem_posse")
      .where("matr", funci.substr(1))
      .fetch();

    const nomeacao = _.head(nom.toJSON());

    return _.isNil(nomeacao) ? Constantes.SEM_IMPEDIMENTO : Constantes.PENDENTE_POSSE;
  } catch(error) {
    throw new exception("Dados das nomeações do funcionário não encontrados.", 400);
  }
}

module.exports = isNomeacaoPendente;