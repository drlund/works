const exception = use("App/Exceptions/Handler");
const Superadm = use("App/Models/Mysql/Superadm");

async function updateSaldoBH (idSolicitacao, saldoBH) {
  try {

    const dados = {saldo_banco_horas: saldoBH}

    const saldoBHUpdate = await Solicitacoes.query()
      .where('id', idSolicitacao)
      .update(despacho);

    return !!saldoBHUpdate;
  } catch (err) {
    throw new exception(err, 404);
  }
}

module.exports = updateSaldoBH;