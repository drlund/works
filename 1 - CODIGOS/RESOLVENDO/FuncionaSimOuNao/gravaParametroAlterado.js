function gravaParametros() {
    if (
      permissao.includes('PARAM_ALCADAS_ADMIN') ||
      permissao.includes('PARAM_ALCADAS_USUARIO') &&
      prefixoDestino === prefixoUsuario
    ) {
      form
        .validateFields()
        .then((dadosForm) => {
          const prefixoDestinoValue = dadosForm.prefixoDestino?.value;
          const { prefixoDestino } = dadosForm;
  
          if (
            prefixoDestinoValue &&
            !prefixosSubordinados.some(
              (prefixoSubordinado) =>
                prefixoSubordinado === prefixoDestinoValue,
            ) &&
            !permissao.includes('PARAM_ALCADAS_ADMIN') // Verifica se não é um ADMIN
          ) {
            message.error('Prefixo de destino não vinculado à jurisdição.');
            return;
          }
  
          const dadosParametro = {
            ...dadosForm,
            prefixoDestino: prefixoDestinoValue,
            nomePrefixo: prefixoDestino?.label?.slice(2).toString(),
            comite: dadosForm.comite?.value,
            nomeComite: dadosForm.comite?.label?.slice(2).toString(),
          };
  
          gravarParametro({ ...dadosParametro, idParametro })
            .then((dadosParametroForm) => {
              setDadosParametroForm(dadosParametroForm);
              history.goBack();
            })
            .catch(() => message.error('Falha ao gravar parâmetro!'));
        })
        .catch((error) => {
          console.log('Erro de validação:', error);
        });
    }
  }