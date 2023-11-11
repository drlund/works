const exception = use('App/Exceptions/Handler');
const Solicitacao = use('App/Models/Mysql/Designacao/Solicitacao');

async function getResponsavel(id) {
  try {
    let solicitacao = await Solicitacao.find(id);

    let responsavel = solicitacao.responsavel;

    return responsavel;
  } catch (err) {
    throw new exception(err, 400);
  }
}

module.exports = getResponsavel;