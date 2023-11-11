const { OrdemServConsts } = use('Constants')
const { TIPO_PARTICIPACAO, ESTADOS } = OrdemServConsts;
const ordemModel = use('App/Models/Mysql/OrdemServ/Ordem');
const participanteExpandidoModel = use('App/Models/Mysql/OrdemServ/ParticipanteExpandido');
const colaboradorModel = use('App/Models/Mysql/OrdemServ/Colaborador');
const exception = use('App/Exceptions/Handler');

/**
 * Metodo utilitario que verifica se o usuario pode editar a ordem solicitada.
 */
async function podeEditarOrdem(idOrdem, matricula) {

  let ordem = await ordemModel.findBy('id', idOrdem);

  if (!ordem) {
    throw new exception("Ordem de serviço não encontrada!", 400);
  }

  //verifica se o estado da ordem permite edicao.
  if ( ![ESTADOS.RASCUNHO, ESTADOS.VIGENTE].includes(ordem.id_estado)) {
    return { result: false, motivo: "Esta ordem não pode ser editada! Estados que permitem edição: RASCUNHO ou VIGENTE."};
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

  let ehDesignante = dadosParticipante ? true : false;

  if (ehDesignante) {
    //pode editar ordem nos dois estados
    return { result: true, motivo: '' };
  }

  //ordem em rascunho, verifica se eh colaborador
  let dadosColaborador = await colaboradorModel.query()
    .where('id_ordem', idOrdem)
    .where('matricula', matricula)
    .first();

  if (dadosColaborador) {
    return { result: true, motivo: ''};
  }

  return { result: false, motivo: "Edição não permitida. Apenas designantes ou colaboradores podem editar esta ordem!"};
}

module.exports = podeEditarOrdem;