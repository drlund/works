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
      permissao.includes('PARAM_ALCADAS_ADMIN') ||
      (permissao.includes('PARAM_ALCADAS_USUARIO') &&
        prefixoUsuario === prefixoDestino?.value)
    ) {
      form
        .validateFields()
        .then(() => {
          const prefixoDestino = dadosForm.prefixoDestino?.value;
          const comite = dadosForm.comite?.value;
          if (
            prefixoDestino &&
            !prefixosSubordinados.includes(prefixoDestino)
          ) {
            message.error('Prefixo de destino não vinculado à jurisdição.');
            return;
          }

          if (comite && temComite.length < 1 && !temComite.includes(comite)) {
            message.error('Prefixo não possui comitê!');
            return;
          }

          gravarParametro({ ...dadosParametro, idParametro })
            .then((dadosParametroForm) => {
              setDadosParametroForm(dadosParametroForm);
              history.goBack();
            })
            .catch(() =>
              message.error(
                'Falha ao gravar parâmetro! Parâmetro já gravado para o prefixo. Verifique!',
              ),
            );
        })
        .catch((error) => {
          error('Erro de validação:', error);
        });
    } else {
      message.error('Prefixo de destino não vinculado à jurisdição.');
    }
  }