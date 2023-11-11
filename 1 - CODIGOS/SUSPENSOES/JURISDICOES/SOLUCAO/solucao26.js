/**
 * Agora entendi o que você está tentando fazer. Para formar o valor de `tipoSelecionado` junto com `chaveJurisdicao` e os valores de 
 * `valorRadioGroup`, você pode fazer isso diretamente dentro da função de validação. Aqui está o código atualizado:

// ...

<Form.Item
  name="tipo"
  label="Tipo"
  rules={[
    {
      required: true,
      message: 'Por favor, selecione um tipo!',
    },
    ({ getFieldValue }) => ({
      validator(_, value) {
        const tipoSelecionado = getFieldValue('tipoSelecionado');
        if (!value || validaJurisdicao.includes(value)) {
          return Promise.resolve();
        }

        if (!tipoSelecionado) {
          return Promise.resolve();
        }

        const chaveJurisdicao = `${tipoSelecionado}Juris`;
        const isValid = validarTipo(value, chaveJurisdicao);

        if (isValid) {
          return Promise.resolve();
        }

        return Promise.reject(
          'O tipo selecionado não é válido para esta opção.',
        );
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

// ...

Nesse trecho, estamos obtendo o valor atual de `tipoSelecionado` usando `getFieldValue('tipoSelecionado')` e, em seguida, formando o valor de `chaveJurisdicao` concatenando `tipoSelecionado` com `'Juris'`. Em seguida, passamos esse valor para a função `validarTipo`. Isso deve garantir que a validação seja feita corretamente, usando os valores corretos para formar a chave da jurisdição. Certifique-se de que o campo `'tipoSelecionado'` seja definido corretamente na parte onde você define o `Form.Item` para selecionar o tipo.