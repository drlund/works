  /**
   * busca os dados da solictação para exibir no data tables e na recorrência
   * @param {Object} request
   * @param {Object} session
   */
  async getSolicitacao({ request, response, session }) {
    const { filtro, idSolicitacao } = request.allParams();
    // pegar os dados do usuario
    const dadosUsuario = session.get("currentUserAccount");

    // Verifica se o usuário é da equipe de comunicação
    const isEquipeComunic = await isEquipeComunicacao(dadosUsuario);

    // Busca os prefixos autorizados
    const prefixosAutorizados = !isEquipeComunic
      ? await getPrefixosAutorizados(dadosUsuario)
      : [];

    const solics = await this._getSolicitacao(
      idSolicitacao,
      prefixosAutorizados,
      filtro
    );
    const solicit = await this._getRespostasSelecionadas(
      solics,
      "table",
      dadosUsuario
    );
    const solicitacoes = solicit.selecao;
    const membroComite = solicit.membroComite;
    const listaStatus = await Status.all();
    const listaAno = await Solicitacao.query()
      .distinct(Database.raw("substring(dataInicioEvento, 1, 4) as ano"))
      .orderBy("dataInicioEvento", "desc")
      .fetch();

    response.send({
      solicitacoes,
      membroComite,
      listaStatus,
      listaAno,
      isEquipeComunic,
    });
  }
