/** 
 * Para permitir a reinclusão do parâmetro alterado para "ativo" novamente, você precisará modificar o código no repositório 
 * `delParametro` e na controller `delParametro`. 
 * 
 * No repositório `delParametro`, em vez de atualizar o campo `ativo` para "0" (desativado), você precisa verificar se o parâmetro 
 * já existe e, em vez de atualizá-lo, defina o campo `ativo` como "1" (ativo). Aqui está uma versão modificada do código:
*/

async delParametro(idParametro) {
  const parametroExistente = await ParamAlcadas.query()
    .where("id", parseInt(idParametro))
    .first();

  if (parametroExistente) {
    parametroExistente.merge({ ativo: "1" });
    await parametroExistente.save();
  } else {
    // Caso o parâmetro não exista, você pode lançar uma exceção ou retornar uma mensagem de erro adequada.
    throw new Error("Parâmetro não encontrado");
  }

  return parametroExistente;
}


/** 
 * Na controller `delParametro`, após chamar `ucExcluirParametro.run()`, você pode verificar se o parâmetro foi excluído ou 
 * reincluído com base no valor retornado. Se o valor for o objeto do parâmetro, significa que ele foi reincluído. Caso contrário, 
 * você pode considerar que o parâmetro foi excluído com sucesso. Aqui está um exemplo de como você pode lidar com isso:
*/

async delParametro({ request, response, session }) {
  const { id: idParametro, observacao } = request.allParams();
  const usuario = session.get("currentUserAccount");
  const acao = "Exclusão";
  const dataAtual = moment().format("YYYY-MM-DD HH:mm:ss");

  const parametroExistente = ParamAlcadas.find(idParametro);
  const observacaoAtualizada = `${parametroExistente.observacao || ''}\nMatrícula: ${usuario.matricula} - Data: ${dataAtual} - Ação: ${acao} - ${observacao}`;

  parametroExistente.merge({ observacao: observacaoAtualizada });
  parametroExistente.save();

  const ucExcluirParametro = new UcExcluirParametro(new TestaParametrosRepository());
  await ucExcluirParametro.validate(idParametro);
  const excluiParametro = await ucExcluirParametro.run();

  let message;
  if (excluiParametro.id === idParametro) {
    message = "Parâmetro reincluído com sucesso";
  } else {
    message = "Parâmetro excluído com sucesso";
  }

  response.ok({ message });
}

/** 
 * Com essas modificações, quando você chamar a rota de reinclusão do parâmetro, ele será alterado para "ativo" novamente, 
 * e a mensagem adequada será retornada na resposta.
 */