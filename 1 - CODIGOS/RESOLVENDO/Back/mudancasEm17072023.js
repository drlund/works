async gravarParametro(novoParametro, parametro) {
    const parametroExistente = await ParamAlcadas.query()
      .where("prefixoDestino", novoParametro.prefixoDestino)
      .where("comissaoDestino", novoParametro.comissaoDestino)
      .first();

    if (parametroExistente) {
      if (parametroExistente.ativo === "1") {
        throw new Error("Parâmetros já existem e estão ativos.");
      } else {
        parametroExistente.ativo = "1";
        parametroExistente.observacao = this.construirObservacao(
          parametroExistente,
          parametro
        );
        await ParamAlcadas.query().where("id", parseInt(parametroExistente.id, 10)).update({
          ativo: parametroExistente.ativo,
          observacao: parametroExistente.observacao,
        });
        return parametroExistente;
      }
    } else {
      // novoParametro.observacao = this.construirObservacao(novoParametro);
      await novoParametro.save();
      return novoParametro;
    }
  }

  async construirObservacao(parametro, session) {
    // const usuario = session.get("currentUserAccount");
    const acao = "Reinclusão";
    const dataAtual = moment().format("YYYY-MM-DD HH:mm:ss");
    return `Matrícula: F8077313 - Data: ${dataAtual} - Ação: ${acao} - ${parametro.observacao}\n\n`;
  }

  /**
   * @param {string} idParametro
   */
  async delParametro(idParametro) {
    const excluiParametro = await ParamAlcadas.query()
      .where("id", parseInt(idParametro))
      .update({ ativo: "0" });

    return excluiParametro;
  }