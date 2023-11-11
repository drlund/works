  function editaSuspensao() {
    const dadosForm = form.getFieldsValue();

    const dadosSuspensao = {
      ...dadosForm,
      [tipoSelecionado]: dadosForm.tipo,
      tipo: undefined,
      matriculaResponsavel: dadosDoUsuario.matricula,
      validade: moment(dadosForm.validade).format('YYYY-MM-DD'),
    };

    const tipos = [
      'vicePresi',
      'diretoria',
      'super',
      'gerev',
      'prefixo',
      'matricula',
    ];
    for (const tipo of tipos) {
      if (tipo !== tipoSelecionado) {
        dadosSuspensao[tipo] = '0';
      }
    }

    if (permissao.includes('PARAM_SUSPENSOES_USUARIO')) {
      form.validateFields().then(() => {
        patchSuspensao({ ...dadosSuspensao })
          .then((dadosSuspensoesForm) => {
            setDadosSuspensoesForm(dadosSuspensoesForm);
            history.goBack();
          })
          .catch(() => message.error('Falha ao editar suspensão!'));
      });
    }
  }