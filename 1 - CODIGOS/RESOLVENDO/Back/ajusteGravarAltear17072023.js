/**
 * Essas alterações devem permitir que a alteração seja concluída corretamente. Lembre-se de adaptar esses exemplos ao 
 * seu código real, levando em consideração a estrutura e as necessidades específicas do seu sistema.
 */

/**
 * Para ajustar as chamadas dos métodos `gravarParametro` e `patchParametros` na sua repository e concluir a alteração, 
 * você pode fazer as seguintes modificações: 
 * 
 * Na função `gravarParametro` da sua repository, em vez de usar o método `save()` diretamente no registro existente, 
 * você pode criar um novo objeto com os valores atualizados e chamar o método `merge()` antes de salvar. Aqui está um 
 * exemplo:
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
      parametroExistente.merge({ ativo: '1', observacao: novoParametro.observacao });
      await parametroExistente.save();
      return parametroExistente;
    }
  } else {
    await novoParametro.save();
    return novoParametro;
  }
}


/** 
 * Na função `patchParametros` da sua repository, você pode chamar os métodos `patchParametros` e `patchParametrosObservacao` 
 * para atualizar os campos desejados:
 */


async patchParametros(idParametro, novoParametro) {
  await ParamAlcadas.query().where("id", idParametro).update(novoParametro);
}

async patchParametrosObservacao(idParametro, observacao) {
  await ParamAlcadas.query().where("id", idParametro).update({ observacao });
}
