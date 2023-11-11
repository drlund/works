/**
 * Método para validar o status atual da solicitação
 * Estados possíveis:
 *  SOLICITADO: Solicitação em análise
 *  AUTORIZADO: Solicitação analisada e autorizada
 *  NÃO-AUTORIZADO: Solicitação analisada e não autorizada
 */
const exception = use('App/Exceptions/Handler');
const Solicitacao = use('App/Models/Mysql/Designacao/Solicitacao');

async function validarStatus(id, novoStatus) {
  try {

    const solicitacao = await Solicitacao.find(id);

    solicitacao.id_status = novoStatus;
    solicitacao.concluido = 1;

    await solicitacao.save()

    return solicitacao.id

  } catch (err) {
    throw new exception(err, 400);
  }
}

module.exports = validarStatus;