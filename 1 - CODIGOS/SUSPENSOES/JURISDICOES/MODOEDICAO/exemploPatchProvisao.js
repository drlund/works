function gravaEditaProvisao() {
    const dadosForm = form.getFieldsValue();

    const dadosProvisao = {
      ...dadosForm,
      competenciaProvisao: moment(dadosForm.competenciaProvisao).format(
        'YYYY-MM-DD HH:mm',
      ),
      id,
    };

    if (id) {
      patchProvisao(dadosProvisao)
        .then((dadosProvisaoForm) => {
          setDadosProvisaoForm(dadosProvisaoForm);
          history.goBack();
        })
        .catch(() => message.error('Falha ao editar provisão!'));
    } else {
      gravarProvisao({ ...dadosProvisao, idProjeto })
        .then((dadosProvisaoForm) => {
          setDadosProvisaoForm(dadosProvisaoForm);
          history.goBack();
        })
        .catch(() => message.error('Falha ao gravar provisão do patrocínio!'));
    }
  }