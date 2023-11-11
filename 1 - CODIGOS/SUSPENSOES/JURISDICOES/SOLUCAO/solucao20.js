/**
 * Refatorar o código para torná-lo mais legível e remover a função de dentro do `validator`. Aqui está como você pode fazer isso:

1. Defina uma função que faça a validação do valor em relação aos dados da jurisdição:

function validarTipo(value, tipoSelecionado) {
  const chaveJurisdicao = `${tipoSelecionado}_juris`;

  const dadosDaJurisdicao = dadosJurisdicoes[chaveJurisdicao];
  if (!dadosDaJurisdicao) {
    return false;
  }

  const valoresDaJurisdicao = dadosDaJurisdicao.map(item => Object.values(item)[0]);
  return valoresDaJurisdicao.includes(value);
}

2. Em seguida, utilize essa função no `validator` do campo "tipo":

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
        if (!value || validaJurisdicao.includes(value)) {
          return Promise.resolve();
        }

        const tipoSelecionado = getFieldValue('tipoSelecionado'); // Certifique-se de que o nome do campo seja correto
        const isValid = validarTipo(value, tipoSelecionado);

        if (isValid) {
          return Promise.resolve();
        }

        return Promise.reject(
          'O tipo selecionado não é válido para esta opção.'
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

Certifique-se de ajustar `getFieldValue('tipoSelecionado')` para obter o valor correto do campo que armazena o tipo selecionado. Com esta abordagem, a função de validação é isolada e pode ser reutilizada se necessário, tornando o código mais organizado e legível.