/**
 * No exemplo abaixo, estamos usando um bloco `try/catch` para capturar erros que podem ser lançados pela função `gravarSuspensao`. Se um erro for capturado, 
 * verificamos se há uma mensagem de erro personalizada no objeto de resposta (supondo que o erro seja retornado no formato de resposta JSON), e exibimos essa 
 * mensagem no frontend. Se não houver uma mensagem de erro personalizada, exibimos uma mensagem de erro genérica.
 * 
 * Para capturar e exibir o erro "Suspensão já existe e está ativa" do seu backend no frontend, você pode fazer o seguinte:
 * 
 * 1. Na função `gravaSuspensao`, onde você chama `gravarSuspensao`, você pode adicionar um bloco `try/catch` para capturar o erro e exibir uma mensagem 
 * personalizada no frontend. Algo assim:
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
      } catch (error) {
        if (message.error(error.response.data)) {
          // Exibir a mensagem de erro no frontend
          message.error(error.response.data);
        } else {
          message.error('Falha ao gravar suspensão! Verifique!');
        }
      }
    });
  }
}
