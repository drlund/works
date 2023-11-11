const editaPlataforma = ( values) => {
    const dadosForm = values;

    const dadosPlataforma = {
      ...dadosForm,
      id,
      nome,
      matriculaResponsavel: dadosForm.matriculaResponsavel.value,
      nomeResponsavel: dadosForm.matriculaResponsavel.label?.slice(2).toString(),
    };

    if (id) {
      patchPlataforma(dadosPlataforma)
        .then((dadosPlataformaForm) => {
          setDadosPlataformaForm(dadosParametroForm);
          history.goBack();
        })
        .catch(() => message.error('Falha ao editar plataforma!'));
    }
  };