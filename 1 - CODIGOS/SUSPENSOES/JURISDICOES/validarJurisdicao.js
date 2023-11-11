/**
 * Nesse exemplo, estamos usando a função `validaJurisdicao.includes(value)` dentro das regras do campo "tipo" para verificar 
 * se o valor digitado está presente nos tipos válidos para a opção selecionada no `Radio.Group`. Se não estiver presente, 
 * uma mensagem de erro será exibida ao usuário. Certifique-se de ajustar o código conforme necessário para se adequar ao 
 * restante da lógica do seu aplicativo.
 * 
 * Para verificar se o valor digitado pelo usuário no campo "tipo" está presente na coluna correspondente em `getTiposJurisdicoes`, 
 * você pode fazer o seguinte:
 * 
 * 1. Primeiro, você pode criar um estado para armazenar os tipos de jurisdições que são válidos para cada opção do `Radio.Group`. 
 * Isso ajudará a fazer a verificação posteriormente.
 * 
 * 2. No `handleTipoChange`, você pode definir o valor selecionado no estado `tipoSelecionado` e também atualizar o estado 
 * `validaJurisdicao` com os tipos válidos para essa seleção.
 * 
 * 3. Quando o usuário preenche o campo "tipo" no formulário, você pode verificar se o valor está presente nos tipos válidos 
 * usando o estado `tiposValidos`.
 * 
 * Aqui está como você pode implementar essas etapas:
 */
 
// ... Seu código existente ...

function FormParamSuspensao({ location }) {
  const [validaJurisdicao, setValidaJurisdicao] = useState([]);
  // Resto do código...

  const handleTipoChange = (/** @type {{ target: { value: any; }; }} */ e) => {
    const valorSelecionado = e.target.value;

    if (!tipoJurisdicoesMap[valorSelecionado]) {
      message.error('Opção de tipo selecionada inválida!');
      return;
    }

    const valorRadioGroup = tipoJurisdicoesMap[valorSelecionado];
    setTipoSelecionado(valorRadioGroup);

    let formatoInput = '';
    switch (valorRadioGroup) {
      // ... Resto do código ...
    }

    // Atualiza os tipos válidos para a seleção atual
    setValidaJurisdicao(Object.keys(dadosJurisdicoes).filter(tipo => tipo === tipoJurisdicoesMap[valorSelecionado]));
    
    form.setFieldsValue({ tipo: '' });
    form.setFields([{ name: 'tipo', value: '' }]);
    setTipoInputValue(formatoInput);
  };

  // Resto do código...

  return (
    <>
      {/* ... Seu código existente ... */}
      <Form
        form={form}
        {...layout}
        name="control-ref"
        onFinish={gravaSuspensao}
      >
        {/* ... Seu código existente ... */}
        <Form.Item
          name="tipo"
          label="Tipo"
          rules={[
            {
              required: true,
              message: 'Por favor, selecione um tipo!',
            },
            ({getFieldValue}) => ({
              validator(_, value) {
                if (!value || validaJurisdicao.includes(value)) {
                  return Promise.resolve();
                }
                return Promise.reject('O tipo selecionado não é válido para esta opção.');
              },
            }),
          ]}
        >
          <InputPrefixoAlcada
            placeholder="Tipo"
            value={tipoInputValue}
            ref={tipoInputRef}
          />
        </Form.Item>
        {/* ... Seu código existente ... */}
      </Form>
      {/* ... Seu código existente ... */}
    </>
  );
}

export default FormParamSuspensao;
