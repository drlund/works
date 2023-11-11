/**Parece que o problema ocorre ao tentar atualizar o registro existente, reativando-o e adicionando uma nova observação. 
 * O erro indicado na mensagem sugere um problema de sintaxe na consulta SQL gerada. Parece que a construção da consulta 
 * não está sendo feita corretamente. 
 * 
 * Uma possível solução para atualizar o registro existente sem criar um novo registro é utilizar o método `update()` 
 * em vez de `save()` na sua função `gravarParametro()` na repository. Aqui está um exemplo de como você pode modificar o código:
*/

/**
 * Nesse exemplo, utilizamos o método `update()` da sua ORM para atualizar o registro existente. Certifique-se de fornecer 
 * o `id` do registro correto na cláusula `where` para especificar qual registro deve ser atualizado. 
 * 
 * Recomendo testar essa modificação para ver se resolve o erro de sintaxe na consulta SQL e atualiza corretamente o registro 
 * existente.
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
      parametroExistente.ativo = "1";
      parametroExistente.observacao = this.construirObservacao(
        parametroExistente,
        parametro
      );
      await ParamAlcadas.query()
        .where("id", parametroExistente.id)  // Aqui você especifica o id do registro a ser atualizado
        .update({
          ativo: parametroExistente.ativo,
          observacao: parametroExistente.observacao
        });
      return parametroExistente;
    }
  } else {
    // Se o registro não existe, você pode fazer a inclusão normalmente
    novoParametro.observacao = this.construirObservacao(novoParametro);
    await novoParametro.save();
    return novoParametro;
  }
}
