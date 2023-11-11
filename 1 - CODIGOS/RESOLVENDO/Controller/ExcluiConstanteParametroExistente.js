/** 
 * Para excluir a constante "parametroExistente" do método, você precisa remover todas as referências a ela e ajustar o 
 * código em conformidade. Aqui está o código modificado sem a constante "parametroExistente":
 * 
 * Nesse código, removi a linha `const parametroExistente = ParamAlcadas.find(idParametro);` e também a linha 
 * `parametroExistente.merge({ observacao: observacaoAtualizada });`, pois elas não são mais necessárias. Certifique-se de 
 * revisar o código completo para garantir que todas as alterações necessárias tenham sido feitas de acordo com a lógica do programa.
 */


async delParametro({ request, response, session }) {
  const { id: idParametro, observacao } = request.allParams();
  const usuario = session.get("currentUserAccount");
  const acao = "Exclusão";
  const dataAtual = moment().format("YYYY-MM-DD HH:mm:ss");

  const observacaoAtualizada = `Matrícula: ${
    usuario.matricula
  } - Data: ${dataAtual} - Ação: ${acao} - ${observacao}`;

  const ucExcluirParametro = new UcExcluirParametro(
    new TestaParametrosRepository()
  );
  await ucExcluirParametro.validate(idParametro);
  const excluiParametro = await ucExcluirParametro.run();

  response.ok(excluiParametro);
}
