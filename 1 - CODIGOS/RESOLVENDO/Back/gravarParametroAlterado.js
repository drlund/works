async gravarParametro(novoParametro, session, {request}) {
    const dadosDosParametros = request.allParams();
    const parametroExistente = await ParamAlcadas.query()
      .where("prefixoDestino", novoParametro.prefixoDestino)
      .where("comissaoDestino", novoParametro.comissaoDestino)
      .fetch();

    if (parametroExistente["rows"].length > 0) {
      const registroExiste = parametroExistente["rows"][0];

      if (registroExiste.ativo === "1") {
        throw new Error("Parâmetros já existem e estão ativos.");
      } else {
        registroExiste.ativo = "1";
        // await registroExiste.save();
        // return registroExiste;
      } if(registroExiste.ativo === "1"){
        dadosDosParametros.matricula = usuario.matricula;
        dadosDosParametros.nome_usuario = usuario.nome_usuario;
        dadosDosParametros.observacao = `Matrícula: ${usuario.matricula} - Data: ${moment().format("YYYY-MM-DD HH:mm:ss")} - Ação: Reinclusão - ${registroExiste.observacao}`;
        await registroExiste.save(dadosDosParametros);
        return registroExiste;
      }

    } else {
      await novoParametro.save();
      return novoParametro;
    }
  }