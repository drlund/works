/**
 * Como os valores em "tipoSelecionado" e "dadosJurisdicoes" têm nomenclaturas ligeiramente diferentes, é necessário fazer uma conversão antes 
 * de realizar a verificação. Aqui está como você pode fazer isso:

1. Modifique a função de validação no `rules` do campo "tipo" para fazer a conversão antes de verificar se o valor digitado está contido nos dados da jurisdição correspondente:

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

        const converteTipoSelecionado = tipoSelecionado.replace('_juris', '');
        const dadosDaJurisdicao = dadosJurisdicoes[converteTipoSelecionado] || [];

        if (dadosDaJurisdicao.some(item => item[converteTipoSelecionado] === value)) {
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

Neste código, estamos removendo o sufixo "_juris" do valor em "tipoSelecionado" para fazer a conversão. Em seguida, verificamos se o valor digitado está contido nos dados da jurisdição correspondente utilizando a função `some` para verificar se existe algum item nos dados da jurisdição que corresponde ao valor digitado.

Certifique-se de testar novamente e verifique se os valores são comparados e convertidos corretamente. Isso deve resolver o problema da validação e garantir que os valores digitados sejam verificados corretamente com base nos dados da jurisdição.