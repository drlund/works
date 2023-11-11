/**
 * Com base nas alterações sugeridas, aqui está a reescrita da função `gravaParametros` com as chamadas para 
 * verificar e atualizar o status do parâmetro:
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

  if (
    permissao.includes("PARAM_ALCADAS_ADMIN") ||
    (permissao.includes("PARAM_ALCADAS_USUARIO") &&
      prefixoUsuario === prefixoDestino?.value)
  ) {
    form
      .validateFields()
      .then(async () => {
        const prefixoDestino = dadosForm.prefixoDestino?.value;
        const comite = dadosForm.comite?.value;
        if (prefixoDestino && !prefixosSubordinados.includes(prefixoDestino)) {
          message.error("Prefixo de destino não vinculado à jurisdição.");
          return;
        }

        if (comite && temComite.length < 1 && !temComite.includes(comite)) {
          message.error("Prefixo não possui comitê!");
          return;
        }

        try {
          const dadosParametroForm = await gravarParametro({ ...dadosParametro, idParametro });
          setDadosParametroForm(dadosParametroForm);

          // Verificar o status do parâmetro existente
          const statusParametroExistente = await verificarStatusParametro(dadosParametro.prefixoDestino, dadosParametro.comissaoDestino);

          if (statusParametroExistente === "0") {
            // Atualizar o status do parâmetro para "ativo"
            await atualizarStatusParametro(dadosParametro.prefixoDestino, dadosParametro.comissaoDestino, "1");
          }

          history.goBack();
        } catch (error) {
          message.error("Falha ao gravar parâmetro! Parâmetro já gravado para o prefixo. Verifique!");
        }
      })
      .catch((error) => {
        console.error("Erro de validação:", error);
      });
  } else {
    message.error("Prefixo de destino não vinculado à jurisdição.");
  }
}

/**
 * Nessa reescrita, após a chamada para a função `gravarParametro`, realizamos a verificação do status do parâmetro 
 * existente usando a função `verificarStatusParametro`. Se o status for "0" (inativo), chamamos a função 
 * `atualizarStatusParametro` para atualizar o status para "1" (ativo).
 * 
 * Certifique-se de importar corretamente as funções `verificarStatusParametro` e `atualizarStatusParametro` no escopo 
 * onde a função `gravaParametros` está definida, e também de definir as dependências necessárias para utilizá-las.
*/