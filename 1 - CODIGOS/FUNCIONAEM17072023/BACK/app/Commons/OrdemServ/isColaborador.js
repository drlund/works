const ordemModel = use('App/Models/Mysql/OrdemServ/Ordem');
const colaboradorModel = use('App/Models/Mysql/OrdemServ/Colaborador');
const exception = use('App/Exceptions/Handler');

/**
 * Metodo utilitario que verifica se o usuario participa como designante da ordem solicitada.
 */
async function isColaborador(idOrdem, matricula) {

  let ordem = await ordemModel.findBy('id', idOrdem);

  if (!ordem) {
    throw new exception("Ordem de serviço não encontrada!", 400);
  }

  //ordem em rascunho, verifica se eh colaborador
  let dadosColaborador = await colaboradorModel.query()
    .where('id_ordem', idOrdem)
    .where('matricula', matricula)
    .first();

  return dadosColaborador ? true : false;
}

module.exports = isColaborador;