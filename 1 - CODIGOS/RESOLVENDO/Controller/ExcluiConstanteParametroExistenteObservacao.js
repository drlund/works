/**
 * Peço desculpas pela confusão anterior. Se a constante "observacaoAtualizada" é necessária para incrementar a observação gravada no banco 
 * de dados, você pode modificá-la para atualizar a observação existente concatenando a nova observação. Aqui está o código ajustado:
 * 
 * Nesse código, a constante "observacaoAtualizada" foi mantida e é utilizada para concatenar a observação existente com a nova observação. 
 * O valor atualizado é então atribuído ao campo "observacao" do objeto "parametroExistente" e salvo no banco de dados com a linha 
 * `parametroExistente.save();`. Certifique-se de revisar o código completo para garantir que todas as alterações necessárias tenham sido feitas corretamente.
 */

async delParametro({ request, response, session }) {
  const { id: idParametro, observacao } = request.allParams();
  const usuario = session.get("currentUserAccount");
  const acao = "Exclusão";
  const dataAtual = moment().format("YYYY-MM-DD HH:mm:ss");

  const parametroExistente = ParamAlcadas.find(idParametro);
  const observacaoAtualizada = `${
    parametroExistente.observacao || ""
  }\nMatrícula: ${
    usuario.matricula
  } - Data: ${dataAtual} - Ação: ${acao} - ${observacao}`;

  parametroExistente.merge({ observacao: observacaoAtualizada });
  parametroExistente.save();

  const ucExcluirParametro = new UcExcluirParametro(
    new TestaParametrosRepository()
  );
  await ucExcluirParametro.validate(idParametro);
  const excluiParametro = await ucExcluirParametro.run();

  response.ok(excluiParametro);
}

