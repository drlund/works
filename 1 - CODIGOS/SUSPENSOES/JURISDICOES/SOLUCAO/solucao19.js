/**
 * Vou ajustar o código para garantir que os valores sejam buscados corretamente em "dadosJurisdicoes". Aqui está o trecho corrigido para o 
 * `validator` do campo "tipo":

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

        const chaveJurisdicao = `${tipoSelecionado}_juris`;

        const dadosDaJurisdicao = dadosJurisdicoes[chaveJurisdicao];
        if (!dadosDaJurisdicao) {
          return Promise.reject('Dados da jurisdição não encontrados.');
        }

        const valoresDaJurisdicao = dadosDaJurisdicao.map(item => Object.values(item)[0]);

        if (valoresDaJurisdicao.includes(value)) {
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

Neste código, verificamos se os dados da jurisdição correspondente existem em `dadosJurisdicoes`. Se existirem, mapeamos os valores da jurisdição usando `Object.values(item)[0]` para extrair o valor de cada item do array. Em seguida, verificamos se o valor digitado está contido nos valores da jurisdição.

Certifique-se de que os nomes das jurisdições em `tipoSelecionado` correspondam exatamente aos nomes usados em `dadosJurisdicoes` e que as chaves dos objetos dentro dos arrays da jurisdição correspondam à estrutura que você mencionou anteriormente. Isso deve permitir que a validação funcione corretamente e verifique se o valor digitado está contido nos dados da jurisdição selecionada.