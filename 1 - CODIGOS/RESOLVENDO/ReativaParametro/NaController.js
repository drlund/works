/**
 * Se você deseja chamar as funções `verificarStatusParametro` e `atualizarStatusParametro` na sua controller e integrá-las 
 * com os métodos existentes, você pode fazer da seguinte maneira:
 */


async delParametro({ request, response, session }) {
  const { id: idParametro, observacao } = request.allParams();
  const usuario = session.get("currentUserAccount");
  const acao = "Exclusão";
  const dataAtual = moment().format("YYYY-MM-DD HH:mm:ss");

  const parametroExistente = ParamAlcadas.find(idParametro);
  const observacaoAtualizada = `${parametroExistente.observacao || ""}\nMatrícula: ${usuario.matricula} - Data: ${dataAtual} - Ação: ${acao} - ${observacao}`;

  parametroExistente.merge({ observacao: observacaoAtualizada });
  parametroExistente.save();

  const ucExcluirParametro = new UcExcluirParametro(new TestaParametrosRepository());
  await ucExcluirParametro.validate(idParametro);
  const excluiParametro = await ucExcluirParametro.run();

  // Verifica se o parâmetro foi excluído com sucesso
  if (excluiParametro) {
    // Verifica o status do parâmetro existente
    const statusParametroExistente = await verificarStatusParametro(parametroExistente.prefixoDestino, parametroExistente.comissaoDestino);

    if (statusParametroExistente === "0") {
      // Atualizar o status do parâmetro para "ativo"
      await atualizarStatusParametro(parametroExistente.prefixoDestino, parametroExistente.comissaoDestino, "1");
    }

    response.ok(excluiParametro);
  } else {
    response.error("Falha ao excluir parâmetro");
  }
}

/**
 * No exemplo acima, após a execução do método `ucExcluirParametro.run()`, verificamos se o parâmetro foi excluído com sucesso. 
 * Em seguida, utilizamos a função `verificarStatusParametro` para obter o status do parâmetro existente com base nos campos 
 * `prefixoDestino` e `comissaoDestino`. Se o status for "0" (inativo), chamamos a função `atualizarStatusParametro` para 
 * atualizar o status para "1" (ativo).
 * 
 * Essas chamadas podem coexistir com os métodos existentes na sua controller, desde que as dependências necessárias, como as 
 * funções `verificarStatusParametro` e `atualizarStatusParametro`, estejam devidamente importadas e acessíveis no escopo da 
 * controller. Certifique-se de importar corretamente as funções e definir as dependências necessárias para a utilização desses 
 * métodos.
*/