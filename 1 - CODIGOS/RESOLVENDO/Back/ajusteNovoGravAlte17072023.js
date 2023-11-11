/**A função `gravarParametro` está substituindo a observação existente em vez de incluir uma nova observação no banco de dados. 
 * Para corrigir isso, você pode ajustar a lógica da função `gravarParametro` para adicionar a nova observação ao registro existente.
 * 
 * Aqui está uma sugestão de como modificar a função `gravarParametro` para incluir a nova observação sem apagar os registros 
 * anteriores:
*/

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
      parametroExistente.observacao += `\n${novoParametro.observacao}`; // Adiciona a nova observação à observação existente
      await parametroExistente.save();
      return parametroExistente;
    }
  } else {
    await novoParametro.save();
    return novoParametro;
  }
}


/**
 * Com essa modificação, a nova observação será concatenada à observação existente, adicionando uma quebra de linha ("\n") para 
 * separar as observações. 
 * 
 * Dessa forma, ao chamar a função `patchParametros` na sua useCase, você pode passar a observação atualizada que será adicionada 
 * ao registro existente:
*/


async patchParametros(idParametro, novoParametro) {
  await this.ParametrosAlcadasRepository.patchParametrosObservacao(idParametro, novoParametro.observacao);
  await ParamAlcadas.query().where("id", idParametro).update(novoParametro);
}
