function gravaEditaOrcamento() {
    const dadosForm = form.getFieldsValue();
    // location.state.record;

    const dadosOrcamento = {
      ...dadosForm,
      prefixoOrigem: dadosForm.prefixo.value,
      nomePrefixoOrigem: dadosForm.prefixo.label.slice(2).toString(),
      id,
    };

    if (id) {
      patchOrcamento(dadosOrcamento)
        .then((dadosOrcamentoForm) => {
          setDadosOrcamentoForm(dadosOrcamentoForm);
          history.goBack();
        })
        .catch(() => message.error('Falha ao editar orçamento!'));
    } else {
      gravarOrcamento({ ...dadosOrcamento, idProjeto })
        .then((dadosOrcamentoForm) => {
          setDadosOrcamentoForm(dadosOrcamentoForm);
          history.goBack();
        })
        .catch(() => message.error('Falha ao gravar orçamento!'));
    }
  }