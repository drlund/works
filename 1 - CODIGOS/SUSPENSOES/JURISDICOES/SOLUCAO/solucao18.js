// Vamos corrigir isso:

/** 
 * 1. No trecho do `validator` do campo "tipo", não é necessário usar `selectedJurisdicao`. Você pode acessar diretamente o nome da jurisdição 
 * a partir do `tipoSelecionado`:

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

        const dadosDaJurisdicao = dadosJurisdicoes[chaveJurisdicao] || [];
        const valoresDaJurisdicao = dadosDaJurisdicao.map(item => item[chaveJurisdicao]);

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

Certifique-se de que o nome da jurisdição no `tipoSelecionado` corresponda ao nome que está nas chaves do objeto `dadosJurisdicoes`, seguido do sufixo `_juris`. Por exemplo, se `tipoSelecionado` for "supers", a chave correspondente em `dadosJurisdicoes` deve ser "supers_juris". Certifique-se também de que o objeto `tipoJurisdicoesMap` esteja mapeando corretamente esses nomes. Isso deve permitir que a validação funcione corretamente, comparando o valor digitado com os dados da jurisdição correspondente.