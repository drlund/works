async gravarParametro(novoParametro) {
    const parametroExistente = await ParamAlcadas.query()
      .where("prefixoDestino", novoParametro.prefixoDestino)
      .where("comissaoDestino", novoParametro.comissaoDestino)
      .first();
  
    if (parametroExistente) {
      if (parametroExistente.ativo === "1") {
        throw new Error("Parâmetros já existem e estão ativos.");
      } else {
        parametroExistente.ativo = "1";
        parametroExistente.observacao = this.construirObservacao(parametroExistente);
        await parametroExistente.save();
        return parametroExistente;
      }
    } else {
      novoParametro.observacao = this.construirObservacao(novoParametro);
      await novoParametro.save();
      return novoParametro;
    }
  }
  
  construirObservacao(parametro) {
    const usuario = "Obtenha o usuário atual, provavelmente por meio de algum serviço ou contexto.";
    const acao = "Inclusão";
    const dataAtual = moment().format("YYYY-MM-DD HH:mm:ss");
    return `Matrícula: ${usuario.matricula} - Data: ${dataAtual} - Ação: ${acao} - ${parametro.observacao}`;
  }
  