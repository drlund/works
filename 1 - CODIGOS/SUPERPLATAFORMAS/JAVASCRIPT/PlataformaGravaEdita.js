function editarPlataforma() {
    const dadosForm = form.getFieldsValue();

    const dadosPlataforma = {
      ...dadosForm,
      matriculaResponsavel: dadosForm.matriculaResponsavel.value,
      nomeResponsavel: dadosForm.matriculaResponsavel.label.slice(2).toString(),
      id,
    };

    if (id) {
      patchOrcamento(dadosPlataforma)
        .then((dadosFormPlataforma) => {
          setDadosFormPlataforma(dadosFormPlataforma);
          history.goBack();
        })
        .catch(() => message.error('Falha ao editar plataforma!'));
    }
  }