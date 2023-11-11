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
        ) 
    {
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
            message.error('Prefixo informado para comitê, não possui comitê!!');
            return;
          }

          try {
            gravarParametro({ ...dadosParametro, idParametro });
            setDadosParametroForm(dadosParametroForm);
            history.goBack();
          } catch (error) {
            if (
              error.response &&
              error.response.status === 409 &&
              error.response.data &&
              error.response.data.error === "Duplicate Entry"
            ) {
              const { prefixoDestino, comissaoDestino } = dadosParametro;
              const statusParametroExistente = verificarStatusParametro(prefixoDestino, comissaoDestino.value);
        
              if ((statusParametroExistente.PrefixoDestino && statusParametroExistente.comissaoDestino.value) === "0") {
                // Atualizar o status do parâmetro para "ativo"
                atualizarStatusParametro(prefixoDestino, comissaoDestino, "1");
                message.success("Parâmetro atualizado com sucesso");
                history.goBack();
              } else {
                message.error("Parâmetro duplicado já existe");
              }
            } else {
              message.error("Falha ao gravar parâmetro");
            }
          }
        }
      )
    }
      message.error('Prefixo de destino não vinculado à jurisdição.');

  }