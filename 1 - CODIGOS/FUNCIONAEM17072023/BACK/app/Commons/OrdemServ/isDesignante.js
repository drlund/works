const { OrdemServConsts } = use('Constants')
const { TIPO_PARTICIPACAO } = OrdemServConsts;
const ordemModel = use('App/Models/Mysql/OrdemServ/Ordem');
const participanteExpandidoModel = use('App/Models/Mysql/OrdemServ/ParticipanteExpandido');
const exception = use('App/Exceptions/Handler');

/**
 * Metodo utilitario que verifica se o usuario participa como designante da ordem solicitada.
 */
async function isDesignante(idOrdem, matricula) {

  let ordem = await ordemModel.findBy('id', idOrdem);

  if (!ordem) {
    throw new exception("Ordem de serviço não encontrada!", 400);
  }

  //verifica se o usuario eh designante.
  let dadosParticipante = await participanteExpandidoModel
  .query()
  .whereHas('participanteEdicao.ordem', (builder) => {
    builder.where('id', idOrdem)
      .where('tipo_participacao', TIPO_PARTICIPACAO.DESIGNANTE)
  })
  .where('matricula', matricula)
  .first();

  return dadosParticipante ? true : false;
}

module.exports = isDesignante;