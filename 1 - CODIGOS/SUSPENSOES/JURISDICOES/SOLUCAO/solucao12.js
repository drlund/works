/**
 * Com essa estrutura dos dados em "dadosJurisdicoes", você pode seguir as seguintes etapas para verificar se o valor digitado no campo 
 * "tipo" está contido nos dados da jurisdição correspondente:

1. Modifique a função de validação no `rules` do campo "tipo" para verificar se o valor digitado está contido nos dados da jurisdição correspondente:

<Form.Item
  name="tipo"
  label="Tipo"
  rules={[
    {
      required: true,
      message: 'Por favor, selecione um tipo!',
    },
    () => ({
      validator(_, value) {
        if (!value || validaJurisdicao.includes(value)) {
          return Promise.resolve();
        }

        const jurisdicaoSelecionada = tipoJurisdicoesMap[tipoSelecionado];
        const dadosDaJurisdicao = dadosJurisdicoes[jurisdicaoSelecionada] || [];

        // Obter a chave da jurisdição correspondente
        const chaveJurisdicao = dadosDaJurisdicao[0][selectedJurisdicao];

        if (chaveJurisdicao === value) {
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

Neste código, estamos comparando o valor digitado no campo "tipo" com a chave da jurisdição correspondente nos dados. Se houver correspondência, a validação será considerada bem-sucedida. Caso contrário, a validação será rejeitada.

Certifique-se de que a chave da jurisdição correspondente seja obtida corretamente dos dados e que os valores sejam comparados de acordo. Verifique também se os valores no array de jurisdição estão no formato correto.