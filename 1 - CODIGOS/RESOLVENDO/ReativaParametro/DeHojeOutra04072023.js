/**
 * Nessa nova versão, utilizamos uma função assíncrona imediatamente invocada (IIFE) para envolver a lógica de 
 * gravação do parâmetro. Assim, podemos utilizar o `try-catch` para tratar possíveis erros na chamada à função 
 * `gravarParametro`. No bloco `catch`, verificamos se o erro recebido é uma resposta de status 409 (conflito) 
 * com um código de erro específico para duplicidade (`DuplicateEntry`). Se for o caso, chamamos a função 
 * `verificarStatusParametro` para obter o status do parâmetro existente. Se o status for "0" (inativo), chamamos 
 * a função `atualizarStatusParametro` para atualizar o status para "1" (ativo) e exibimos uma mensagem de sucesso. 
 * Caso contrário, exibimos uma mensagem de erro informando que o parâmetro duplicado já existe. Se o erro não 
 * corresponder aos casos de duplicidade, exibimos uma mensagem genérica de falha ao gravar o parâmetro. 
 * 
 * Lembre-se de importar corretamente as funções `verificarStatusParametro` e `atualizarStatusParametro` no escopo 
 * onde a função `gravaParametros` está definida, e de definir as dependências necessárias para utilizá-las.
 */


function gravaParametros() {
  const dadosForm = form.getFieldsValue();
  const { prefixoDestino } = dadosForm;

  const dadosParametro = {
    ...dadosForm,
    prefixoDestino: dadosForm.prefixoDestino?.value,
    nomePrefixo: prefixoDestino?.label?.slice(2).toString(),

    comite: comite?.value,
    nomeComite: comite?.label?.slice(2).toString(),
  };

  (async () => {
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
  })();
}

