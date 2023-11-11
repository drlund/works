/**
 * Com essas modificações, a validação do formulário verificará se o valor inserido no campo "tipo" é válido para o tipo de jurisdição 
 * selecionado, com base nos dados fornecidos no array "dadosJurisdicoes".
 * 
 * Para validar se o valor inserido no campo "tipo" está contido no tipo de jurisdição selecionado no "Radio.Group," siga esses passos:
 * 
 * 1. Modifique a função `handleTipoChange` para armazenar o tipo de jurisdição selecionado no estado:
 */

const handleTipoChange = (e) => {
  const valorSelecionado = e.target.value;

  if (!tipoJurisdicoesMap[valorSelecionado]) {
    message.error('Opção de tipo selecionada inválida!');
    return;
  }

  const valorRadioGroup = tipoJurisdicoesMap[valorSelecionado];
  setTipoSelecionado(valorRadioGroup);

  // ...resto da função
};

/**
 * 2. Modifique as regras para o campo "tipo" no formulário para incluir um validador personalizado que verifica se o valor inserido é válido 
 * para o tipo de jurisdição selecionado:
 */

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

// 3. Certifique-se de que o array `validaJurisdicao` seja atualizado corretamente quando o tipo de jurisdição for alterado na função `handleTipoChange`:

const handleTipoChange = (e) => {
  // ...código existente

  const dadosJurisdicoes = getTiposJurisdicoes();
  const jurisdicaoSelecionada = tipoJurisdicoesMap[valorSelecionado];

  setValidaJurisdicao(
    Object.values(dadosJurisdicoes).filter(
      (prefixoTipo) => prefixoTipo === jurisdicaoSelecionada
    )
  );

  // ...resto da função
};
