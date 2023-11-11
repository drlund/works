const exception = use('App/Exceptions/Handler');
const Solicitacao = use('App/Models/Mysql/Designacao/Solicitacao');
const Analise = use('App/Models/Mysql/Designacao/Analise');
const Documento = use('App/Models/Mysql/Designacao/Documento');
const Historico = use('App/Models/Mysql/Designacao/Historico');
const MailLog = use('App/Models/Mysql/Designacao/MailLog');

async function rollbackInclusao(id) {
  try {
    await Solicitacao.query(id)
      .where('id', id)
      .delete();

    await Analise.query(id)
      .where('id_solicitacao', id)
      .delete();

    await Documento.query(id)
      .where('id_solicitacao', id)
      .delete();

    await Historico.query(id)
      .where('id_solicitacao', id)
      .delete();

    await MailLog.query(id)
      .where('id_solicitacao', id)
      .delete();

    return true;
  } catch (error) {
    throw new exception(`Erro ao efetuar rollback da gravacao dos dados da solicitacao de id ${id}.`, 404);
  }
}

module.exports = rollbackInclusao;