/**
 * Parece que há uma pequena confusão na lógica do código. Vou explicar como você pode corrigir isso
 * No trecho do código fornecido, você está tentando acessar dadosForm.comite em gravaParametros(), mas essa 
 * chave não está presente no objeto dadosForm retornado pelo form.getFieldsValue().
 * Para corrigir isso, você precisa adicionar o campo comite ao seu formulário.
 * 
 * Aqui está o código atualizado com as alterações necessárias:
 */ 

function FormParamAlcadas({ location }) {
  // ...

  const [form] = Form.useForm();
  // ...

  const initialValues = {
    // ...
    comite: location.state.comite || undefined,
    nomeComite: location.state.nomeComite || '',
  };

  // ...

  function gravaParametros() {
    form
      .validateFields()
      .then((dadosForm) => {
        const { prefixoDestino } = dadosForm;

        const dadosParametro = {
          ...dadosForm,
          prefixoDestino: dadosForm.prefixoDestino?.value,
          nomePrefixo: prefixoDestino?.label?.slice(2).toString(),
        };

        // Restante do código...

        // Agora você pode acessar os valores de comite e nomeComite em dadosForm
        const { comite, nomeComite } = dadosForm;
        // Use os valores como necessário
      })
      .catch((error) => {
        console.log('Erro de validação:', error);
      });
  }

  return (
    // ...
  );
}

export default FormParamAlcadas;
