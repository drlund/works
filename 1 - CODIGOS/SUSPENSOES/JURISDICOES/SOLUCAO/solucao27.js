/**
 * Vamos tentar uma abordagem diferente para garantir que a validação funcione conforme o esperado. Vamos definir uma variável local chamada 
 * `tipoSelecionadoTemp` dentro do escopo da função `handleTipoChange` para armazenar temporariamente o valor de `valorRadioGroup`. Em seguida, 
 * podemos usar essa variável dentro das regras de validação. Aqui está o código atualizado:

// ...

function FormParamSuspensao({ location }) {
  // ...

  const handleTipoChange = (e) => {
    const valorSelecionado = e.target.value;

    if (!tipoJurisdicoesMap[valorSelecionado]) {
      message.error('Opção de tipo selecionada inválida!');
      return;
    }

    const valorRadioGroup = tipoJurisdicoesMap[valorSelecionado];
    setTipoSelecionado(valorRadioGroup);
    setTipoSelecionadoTemp(valorRadioGroup); // Adicione esta linha

    // ...
  };

  // ...

  const [tipoSelecionadoTemp, setTipoSelecionadoTemp] = useState('');

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
          const tipoSelecionado = tipoSelecionadoTemp; // Usamos tipoSelecionadoTemp aqui
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
```

Certifique-se de adicionar a linha `setTipoSelecionadoTemp(valorRadioGroup);` dentro da função `handleTipoChange`. Além disso, use a variável `tipoSelecionadoTemp` dentro das regras de validação para garantir que o valor correto de `tipoSelecionado` seja usado durante a validação. Isso deve resolver o problema de validação que você está enfrentando.