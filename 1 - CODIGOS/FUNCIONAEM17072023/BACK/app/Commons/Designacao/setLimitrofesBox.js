const exception = use('App/Exceptions/Handler');
const Solicitacao = use('App/Models/Mysql/Designacao/Solicitacao');
const setHistorico = require('./setHistorico');

async function setLimitrofesBox(id, user) {

  try {

    const solicitacao = await Solicitacao.findBy('id', id);

    solicitacao.concluido = 1;

    await solicitacao.save();

    const dados = {
      parecer: {
        id_solicitacao: id,
        id_historico: 30
      },
      user: user
    }

    const historico = await setHistorico(dados);

    return historico.id;

  } catch (err) {
    throw new exception(err, 400);
  }

}

module.exports = setLimitrofesBox;