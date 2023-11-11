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
            const errorMessage = error.response.data.error; // Ajuste para obter a mensagem de erro correta
            message.error(errorMessage);
          }
        } else {
          message.error("Falha ao gravar parâmetro");
        }
      }
    })();
  }