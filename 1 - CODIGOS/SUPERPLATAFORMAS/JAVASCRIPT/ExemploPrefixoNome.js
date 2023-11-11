const editaParametro = (/** @type {any} */ values) => {
    const dadosForm = values;

    const dadosParametro = {
      ...dadosForm,
      prefixoDestino: dadosForm.prefixoDestino.value,
      nomePrefixo: dadosForm.prefixoDestino.label?.slice(2).toString(),
      comite: dadosForm.comite.value,
      nomeComite: dadosForm.comite.label?.slice(2).toString(),
      id,
    };

    if (comite && temComite.length < 1 && !temComite.includes(comite)) {
      message.error('Prefixo não possui comitê!');
      return;
    }

    if (id) {
      patchParametros(dadosParametro)
        .then((dadosParametroForm) => {
          setDadosParametroForm(dadosParametroForm);
          history.goBack();
        })
        .catch(() => message.error('Falha ao editar parâmetro!'));
    }
  };