function gravaSuspensao() {
    const dadosForm = form.getFieldsValue();

    const dadosSuspensao = {
      ...dadosForm,
      vicePresi: dadosForm.vicePresi?.value,
      diretoria: dadosForm.diretoria?.value,
      supers: dadosForm.supers?.value,
      gerev: dadosForm.gerev?.value,
      prefixo: dadosForm.prefixo?.value,
    };

    if (
      permissao.includes('PARAM_SUSPENSOES_USUARIO')
    ) {
      form
        .validateFields()
        .then(() => {
          gravarSuspensao({ ...dadosSuspensao, id })
            .then((dadosSuspensoesForm) => {
              setDadosSuspensoesForm(dadosSuspensoesForm);
              history.goBack();
            })
            .catch(() =>
              message.error(
                'Falha ao gravar suspensão! Verifique!',
              ),
            );
        })
        .catch((error) => {
          error('Erro de validação:', error);
        });
    } 
  }