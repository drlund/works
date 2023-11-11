/**
 * Com base na resposta que você recebe ao tentar incluir um parâmetro que já existe, você pode verificar se o parâmetro 
 * existente está "inativo" ("0") ou "ativo" ("1") antes de decidir como lidar com a situação. 
 * 
 * Para fazer isso, você pode realizar uma consulta ao banco de dados para obter o status do parâmetro existente. Em seguida, 
 * com base nesse status, você pode decidir se deve alterar o parâmetro para "ativo" caso esteja "inativo" ou se deve retornar 
 * uma mensagem de erro de duplicidade caso esteja "ativo". 
 * 
 * Aqui está um exemplo de como você pode fazer isso:
*/

async function gravaParametros() {
  // ...

  try {
    await gravarParametro({ ...dadosParametro, idParametro });
    setDadosParametroForm(dadosParametroForm);
    history.goBack();
  } catch (error) {
    if (
      error.response &&
      error.response.status === 409 &&
      error.response.data &&
      error.response.data.error === "DuplicateEntry"
    ) {
      const { prefixoDestino, comissaoDestino } = dadosParametro;
      const statusParametroExistente = await verificarStatusParametro(prefixoDestino, comissaoDestino);

      if (statusParametroExistente === "0") {
        // Atualizar o status do parâmetro para "ativo"
        await atualizarStatusParametro(prefixoDestino, comissaoDestino, "1");
        message.success("Parâmetro atualizado com sucesso");
        history.goBack();
      } else {
        message.error("Parâmetro duplicado já existe");
      }
    } else {
      message.error("Falha ao gravar parâmetro");
    }
  }

  // ...
}

/**
 * No exemplo acima, após receber a exceção de duplicidade e verificar o código de resposta e a mensagem de erro adequada, 
 * você pode chamar a função `verificarStatusParametro` para obter o status do parâmetro existente. Se o status for "0", 
 * você pode chamar a função `atualizarStatusParametro` para alterar o status para "ativo" ("1") antes de retornar uma 
 * mensagem de sucesso. Caso contrário, você pode retornar uma mensagem de erro informando que o parâmetro duplicado já existe.
 * 
 * Certifique-se de implementar as funções `verificarStatusParametro` e `atualizarStatusParametro` no backend para realizar 
 * as consultas e atualizações necessárias no banco de dados com base na estrutura do seu código existente.
*/