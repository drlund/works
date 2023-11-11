/**
 * Você precisa passar o valor correto para o parâmetro `tipoSelecionado` na função de validação. Aqui está a parte do código que você precisa corrigir:

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
        const tipoSelecionado = getFieldValue('tipo'); // Obter o valor do campo "tipo"
        if (!value || validaJurisdicao.includes(value)) {
          return Promise.resolve();
        }

        if (!tipoSelecionado) {
          return Promise.resolve();
        }

        const isValid = validarTipo(value, tipoSelecionado);

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

A mudança chave é substituir `const tipoSelecionado = getFieldValue('tipoSelecionado');` por `const tipoSelecionado = getFieldValue('tipo');`, para que você esteja passando o valor correto para a função `validarTipo`. Dessa forma, a função de validação verificará se o valor digitado no campo "tipo" está contido no array correspondente em "dadosJurisdicoes".