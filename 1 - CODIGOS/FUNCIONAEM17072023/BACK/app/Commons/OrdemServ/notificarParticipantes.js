const { OrdemServConsts } = use('Constants')
const { TIPO_PARTICIPACAO, TIPO_NOTIFICACAO, DEFAULT_REMETENTE_EMAILS } = OrdemServConsts;
const ordemModel = use('App/Models/Mysql/OrdemServ/Ordem');
const participanteExpandidoModel = use('App/Models/Mysql/OrdemServ/ParticipanteExpandido');
const notificacaoModel = use('App/Models/Mysql/OrdemServ/Notificacao');
const TemplateEmailEngine = use('App/Commons/TemplateEmailEngine');
const { registrarAtividadeAplicacao, removeRegistroAtividadeAplicacao } = use('App/Commons/OrdemServ/OrdemServUtils');
const { capitalize } = use('App/Commons/StringUtils');
const { getOneFunci } = use("App/Commons/Arh");

async function solicitarAssinaturaCommon({idOrdem, templatePath, subject, tipoParticipacao, tipoNotificacao}) {
  const ordemAtual = await ordemModel.find(idOrdem);
  const emailEngine = new TemplateEmailEngine(templatePath, { 
    from: DEFAULT_REMETENTE_EMAILS, 
    subject
  });

  const { numero, titulo, descricao} = ordemAtual;

  let listaParticEdicao = await ordemAtual
    .participantesEdicao()
    .where('ativo', 1)
    .where('resolvido', 0)
    .where('tipo_participacao', tipoParticipacao)
    .fetch();

  listaParticEdicao = listaParticEdicao.toJSON();

  for (const vinculoEdicao of listaParticEdicao) {
    //obtem a lista de participantes expandidos
    let listaPartExpand = await participanteExpandidoModel
      .query()
      .where('id_part_edicao', vinculoEdicao.id)
      .where('assinou', 0)
      .where('nao_passivel_assinatura', 0)
      .fetch();

    listaPartExpand = listaPartExpand.toJSON();

    for (const partExpand of listaPartExpand) {
      //ignorando se o participante nao for passivel de assinatura
      if (partExpand.nao_passivel_assinatura) {
        continue;
      }

      let funci = await getOneFunci(partExpand.matricula); 
      let nomeGuerra = capitalize(funci.nomeGuerra);
  
      let enviou = await emailEngine.sendMail({to: funci.email}, [nomeGuerra, numero, titulo, descricao, idOrdem]);
      let resultadoEnvio = enviou ? "Sucesso" : "Falha";

      let notificacao = new notificacaoModel();
      notificacao.id_ordem = idOrdem;
      notificacao.id_tipo_notificacao = tipoNotificacao;
      notificacao.prefixo_participante = partExpand.prefixo;
      notificacao.matricula_participante = partExpand.matricula;
      notificacao.nome_participante = partExpand.nome;
      notificacao.uor_participante = partExpand.uor_participante;
      notificacao.email_destinatario = funci.email;
      notificacao.resultado_envio = resultadoEnvio;

      //inclui a notificacao de envio
      await notificacao.save();
    }
  }
}

async function notificarParticipanteCommon({idOrdem, idPartExpand, templatePath, subject, tipoNotificacao}) {

  const ordemAtual = await ordemModel.find(idOrdem);
  const emailEngine = new TemplateEmailEngine(templatePath, { 
    from: DEFAULT_REMETENTE_EMAILS, 
    subject
  });

  const { numero, titulo, descricao} = ordemAtual;

  //obtem os dados do participante expandido
  let partExpand = await participanteExpandidoModel
    .query()
    .where('id', idPartExpand)
    .first();

  //se encontrou o participante expandido e o mesmo for passivel de receber notificacoes...
  if (partExpand && partExpand.nao_passivel_assinatura === 0) {
    let funci = await getOneFunci(partExpand.matricula); 
    
    if (funci) {
      let nomeGuerra = capitalize(funci.nomeGuerra);
    
      let enviou = await emailEngine.sendMail({to: funci.email}, [nomeGuerra, numero, titulo, descricao, idOrdem]);
      let resultadoEnvio = enviou ? "Sucesso" : "Falha";

      let notificacao = new notificacaoModel();
      notificacao.id_ordem = idOrdem;
      notificacao.id_tipo_notificacao = tipoNotificacao;
      notificacao.prefixo_participante = partExpand.prefixo;
      notificacao.matricula_participante = partExpand.matricula;
      notificacao.nome_participante = partExpand.nome || '';
      notificacao.uor_participante = partExpand.uor_participante;
      notificacao.email_destinatario = funci.email;
      notificacao.resultado_envio = resultadoEnvio;

      //inclui a notificacao de envio
      await notificacao.save();
    }
  }
}

module.exports = {
  /**
   * Metodo utilitario que realiza a notificacao por email solicitando assinatura dos designantes.
   * @param {*} idOrdem 
   */
  notificarDesignantes: async (idOrdem, templatePath = 'OrdemServ/SolicitarAssinatura', titulo = 'Solicitação de Assinatura de Ordem de Serviço') => {

    let idAtividadeApp = null;

    try {  
      //inclui log da atividade na tabela de utilizacao
      idAtividadeApp = await registrarAtividadeAplicacao('notificarDesignantes', idOrdem);
  
      await solicitarAssinaturaCommon({
        idOrdem, 
        templatePath,
        subject: titulo, 
        tipoParticipacao: TIPO_PARTICIPACAO.DESIGNANTE, 
        tipoNotificacao: TIPO_NOTIFICACAO.SOLICITACAO_ASSINATURA
      });

    } finally {
      //remove registro de utilizacao da tabela
      await removeRegistroAtividadeAplicacao(idAtividadeApp);
    }

  },

  /**
   * Metodo utilitario que realiza a notificacao por email solicitando a ciencia dos designados.
   * @param {*} idOrdem 
   */
  notificarDesignados: async (idOrdem, templatePath = 'OrdemServ/SolicitarCiencia') => {

    let idAtividadeApp = null;

    try {  
      //inclui log da atividade na tabela de utilizacao
      idAtividadeApp = await registrarAtividadeAplicacao('notificarDesignados', idOrdem);

      await solicitarAssinaturaCommon({
        idOrdem, 
        templatePath,
        subject: 'Solicitação de Ciência de Ordem de Serviço', 
        tipoParticipacao: TIPO_PARTICIPACAO.DESIGNADO, 
        tipoNotificacao: TIPO_NOTIFICACAO.SOLICITACAO_CIENCIA
      });

    } finally {
        //remove registro de utilizacao da tabela
        await removeRegistroAtividadeAplicacao(idAtividadeApp);
    }
    
  },

  /**
   * Envia email solicitando a assinatura do designante na ordem.
   */
  notificarSolicitacaoAssinaturaParticipante: async ({idOrdem, idPartExpand}) => {
    await notificarParticipanteCommon({
      idOrdem, 
      idPartExpand, 
      templatePath: 'OrdemServ/SolicitarAssinatura', 
      subject: 'Solicitação de Assinatura de Ordem de Serviço', 
      tipoNotificacao: TIPO_NOTIFICACAO.SOLICITACAO_ASSINATURA
    });
  },

  /**
   * Envia email solicitando a ciencia do designado na ordem.
   */
  notificarSolicitacaoCienciaParticipante: async ({idOrdem, idPartExpand}) => {

    await notificarParticipanteCommon({
      idOrdem, 
      idPartExpand, 
      templatePath: 'OrdemServ/SolicitarCiencia', 
      subject: 'Solicitação de Ciência de Ordem de Serviço', 
      tipoNotificacao: TIPO_NOTIFICACAO.SOLICITACAO_CIENCIA
    });

  },

  /**
   * Parâmetros deste template:
   * {1} - Nome de guerra do Funci
   * {2} - Tipo do Participante - (Designante ou Designado)
   * {3} - Numero
   * {4} - Título da Ordem de Serviço
   * {5} - Descrição
   * {6} - Responsável pela Alteração
   * {7} - Motivo da revogação
   */
  notificarRevogacao: async ({idOrdem, idPartExpand, tipoParticipante, responsavelAlteracao, motivoRevogacao}) => {

    let idAtividadeApp = null;

    try {  
      //inclui log da atividade na tabela de utilizacao
      idAtividadeApp = await registrarAtividadeAplicacao('notificarDesignados', idOrdem);

      const ordemAtual = await ordemModel.find(idOrdem);
      const emailEngine = new TemplateEmailEngine('OrdemServ/ParticipanteRevogado', { 
        from: DEFAULT_REMETENTE_EMAILS, 
        subject: 'Revogação de Participação em Ordem de Serviço'
      });
    
      const { numero, titulo, descricao} = ordemAtual;
    
      //obtem os dados do participante expandido
      let partExpand = await participanteExpandidoModel
        .query()
        .where('id', idPartExpand)
        .first();

      //se encontrou o participante expandido e o mesmo for passivel de receber notificacoes...
      if (partExpand && partExpand.nao_passivel_assinatura === 0) {
        let funci = await getOneFunci(partExpand.matricula);

        if (funci) {
          let nomeGuerra = capitalize(funci.nomeGuerra);
        
          let enviou = await emailEngine.sendMail({to: funci.email}, [nomeGuerra, tipoParticipante, numero, titulo, descricao, responsavelAlteracao, motivoRevogacao]);
          let resultadoEnvio = enviou ? "Sucesso" : "Falha";

          let notificacao = new notificacaoModel();
          notificacao.id_ordem = idOrdem;
          notificacao.id_tipo_notificacao = TIPO_NOTIFICACAO.REVOGACAO_ORDEM;
          notificacao.prefixo_participante = partExpand.prefixo;
          notificacao.matricula_participante = partExpand.matricula;
          notificacao.nome_participante = partExpand.nome;
          notificacao.uor_participante = partExpand.uor_participante;
          notificacao.email_destinatario = funci.email;
          notificacao.resultado_envio = resultadoEnvio;

          //inclui a notificacao de envio
          await notificacao.save();
        }
      }

    } finally {
      //remove registro de utilizacao da tabela
      await removeRegistroAtividadeAplicacao(idAtividadeApp);
    }
  },

  /**
   * Parâmetros deste template:
   * {1} - Nome de guerra do Funci
   * {3} - Numero
   * {4} - Título da Ordem de Serviço
   * {5} - Descrição
   * {6} - Responsável pela Alteração
   * {7} - Motivo da revogação
   */
  notificarVigenciaTemporaria: async ({idOrdem, matricula, responsavelAlteracao, motivoRevogacao}) => {

    let idAtividadeApp = null;

    try {  
      //inclui log da atividade na tabela de utilizacao
      idAtividadeApp = await registrarAtividadeAplicacao('notificarDesignados', idOrdem);

      const ordemAtual = await ordemModel.find(idOrdem);
      const emailEngine = new TemplateEmailEngine('OrdemServ/InformaVigenciaTemporaria', { 
        from: DEFAULT_REMETENTE_EMAILS, 
        subject: 'Atenção: Ordem de Serviço em Vigência Temporária'
      });
    
      const { numero, titulo, descricao} = ordemAtual;
    
      //se encontrou o participante expandido e o mesmo for passivel de receber notificacoes...
      let funci = await getOneFunci(matricula);
        
      if (funci) {
        let nomeGuerra = capitalize(funci.nomeGuerra);
      
        let enviou = await emailEngine.sendMail({to: funci.email}, [nomeGuerra, numero, titulo, descricao, responsavelAlteracao, motivoRevogacao]);
        let resultadoEnvio = enviou ? "Sucesso" : "Falha";

        let notificacao = new notificacaoModel();
        notificacao.id_ordem = idOrdem;
        notificacao.id_tipo_notificacao = TIPO_NOTIFICACAO.REVOGACAO_ORDEM;
        notificacao.prefixo_participante = funci.dependencia.prefixo;
        notificacao.matricula_participante = matricula;
        notificacao.nome_participante = funci.nome;
        notificacao.uor_participante = funci.codUorTrabalho;
        notificacao.email_destinatario = funci.email;
        notificacao.resultado_envio = resultadoEnvio;

        //inclui a notificacao de envio
        await notificacao.save();
      }
    } finally {
      //remove registro de utilizacao da tabela
      await removeRegistroAtividadeAplicacao(idAtividadeApp);
    }
  }

}