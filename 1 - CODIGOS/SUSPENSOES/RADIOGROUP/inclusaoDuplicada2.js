/**
 * Se a mensagem de erro tem a estrutura `"Error: Suspensão já existe e está ativa."`, você pode adaptar o código da seguinte forma para capturar essa mensagem 
 * e exibi-la no frontend:
 */

async function gravaSuspensao() {
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
      try {
        gravarSuspensao({ ...dadosSuspensao }).then((dadosSuspensaoForm) => {
          setDadosSuspensaoForm(dadosSuspensaoForm);
          history.goBack();
        });

        const response = await gravarSuspensao

      } catch (error) {
        if (error.message === "Suspensão já existe e está ativa.") {
          // Exibir a mensagem de erro no frontend
          message.error("Suspensão já existe e está ativa.");
        } else {
          message.error('Falha ao gravar suspensão! Verifique!');
        }
      }
    });
  }
}
