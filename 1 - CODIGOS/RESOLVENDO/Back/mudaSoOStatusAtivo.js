async gravarParametro(novoParametro, parametro) {
    const parametroExistente = await ParamAlcadas.query()
      .where("prefixoDestino", novoParametro.prefixoDestino)
      .where("comissaoDestino", novoParametro.comissaoDestino)
      .first();

    if (parametroExistente) {
      if (parametroExistente.ativo === "1") {
        throw new Error("Parâmetros já existem e estão ativos.");
      } else {
        parametroExistente.ativo = '1';
        await parametroExistente.save();
        return parametroExistente;
      }
    } else {
      await novoParametro.save();
      return novoParametro;
    }
  }