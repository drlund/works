/**
 * É possível fazer a alteração na função `gravarParametro` da sua repository para incluir as informações do usuário 
 * e a data atual. Aqui está uma sugestão de como você pode modificar a função para realizar essa tarefa:
 * 
 * Certifique-se de ter o pacote `moment` instalado no seu projeto, pois o código utiliza `moment()` para obter a 
 * data atual no formato desejado. 
 * 
 * Com essas modificações, ao chamar a função `gravarParametro` na sua repository, as informações do usuário e a 
 * data atual serão incluídas no parâmetro existente ou no novo parâmetro, dependendo do caso.
 */

async gravarParametro(novoParametro, usuario) {
  const parametroExistente = await ParamAlcadas.query()
    .where("prefixoDestino", novoParametro.prefixoDestino)
    .where("comissaoDestino", novoParametro.comissaoDestino)
    .fetch();

  if (parametroExistente.rows.length > 0) {
    const registroExiste = parametroExistente.rows[0];

    if (registroExiste.ativo === "1") {
      throw new Error("Parâmetros já existem e estão ativos.");
    } else {
      registroExiste.ativo = "1";
      registroExiste.matricula = usuario.matricula;
      registroExiste.nome_usuario = usuario.nome_usuario;
      registroExiste.observacao = `Matrícula: ${usuario.matricula} - Data: ${moment().format("YYYY-MM-DD HH:mm:ss")} - Ação: Reinclusão - ${registroExiste.observacao}`;
      await registroExiste.save();
      return registroExiste;
    }
  } else {
    novoParametro.matricula = usuario.matricula;
    novoParametro.nome_usuario = usuario.nome_usuario;
    novoParametro.observacao = `Matrícula: ${usuario.matricula} - Data: ${moment().format("YYYY-MM-DD HH:mm:ss")} - Ação: Inclusão - ${novoParametro.observacao}`;

    await novoParametro.save();
    return novoParametro;
  }
}
