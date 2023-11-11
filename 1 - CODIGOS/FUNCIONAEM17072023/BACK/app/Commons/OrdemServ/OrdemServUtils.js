const ordemModel = use('App/Models/Mysql/OrdemServ/Ordem');
const participanteExpandidoModel = use('App/Models/Mysql/OrdemServ/ParticipanteExpandido');
const registroUtilizacaoModel = use('App/Models/Mysql/OrdemServ/RegistroUtilizacao');
const { OrdemServConsts } = use('Constants');
const { TIPO_PARTICIPACAO } = OrdemServConsts;

module.exports = {
  /**
   * Funcao utilitaria - verifica se o participante eh Designante.
   */
  isDesignante: (tipoParticipante) => {
    return new RegExp(TIPO_PARTICIPACAO.DESIGNANTE, 'i').test(tipoParticipante);
  },

  /**
   * Funcao utilitaria - verifica se o participante eh Designado.
   */
  isDesignado: (tipoParticipante) => {
    return new RegExp(TIPO_PARTICIPACAO.DESIGNADO, 'i').test(tipoParticipante);
  },

  /**
   * Funcao utilitaria - verifica se o participante eh Colaborador.
   */
  isColaborador: (tipoParticipante) => {
    return new RegExp(TIPO_PARTICIPACAO.COLABORADOR, 'i').test(tipoParticipante);
  },

  getListaParticipantes: async (idOrdem, tipoParticipante = TIPO_PARTICIPACAO.DESIGNANTE) => {
    let ordemAtual = await ordemModel.find(idOrdem);
    let listaTodosParticipantes = [];

    let listaParticEdicao = await ordemAtual
      .participantesEdicao()
      .where('ativo', 1)
      .where('tipo_participacao', tipoParticipante)
      .fetch();

    listaParticEdicao = listaParticEdicao.toJSON();

    for (const vinculoEdicao of listaParticEdicao) {
      let { id } = vinculoEdicao;

      let listaPartExpand = await participanteExpandidoModel.query()
        .where('id_part_edicao', id)
        .fetch();

      listaPartExpand = listaPartExpand.toJSON();

      for (const partic of listaPartExpand) {
        listaTodosParticipantes.push({...partic});
      }
    }

    return listaTodosParticipantes;
  },

  /**
   * Inclui um novo registro de atividade da ferramenta na tabela de registros de utilizacao.
   * Serao incluidas apenas operações demoradas para que a tabela seja consultada no momento de uma atualizacao
   * do servidor nodejs para que o mesmo nao seja interrompido no meio do processamento.
   */
  registrarAtividadeAplicacao: async (acao, idOrdem = null) => {
    let atividade = new registroUtilizacaoModel();
    atividade.acao = acao;
    atividade.id_ordem = idOrdem;
    await atividade.save();
    return atividade.id;
  },

  /**
   * Remove um registro de atividade previamente cadastradado.
   */
  removeRegistroAtividadeAplicacao: async (idAcao) => {
    const atividade = await registroUtilizacaoModel.find(idAcao);

    if (atividade) {
      await atividade.delete();
    }
  }

}