/**
 * Para atualizar o estado do `Radio.Group` e reiniciar a seleção quando o usuário escolher outra opção, você pode 
 * adicionar um estado para controlar a seleção atual e atualizá-lo quando uma nova opção for escolhida. Aqui está 
 * como você pode fazer isso:
 * 
 * 1. Primeiro, declare um estado para armazenar a opção selecionada no componente `FormParamSuspensao`:
 */

function FormParamSuspensao({ location }) {
  const [tipoSelecionado, setTipoSelecionado] = useState(''); // Adicione esta linha
  // ... (restante do código)
}

/** 2. Em seguida, modifique a função `handleTipoChange` para atualizar o estado `tipoSelecionado` quando uma nova 
 * opção for selecionada:
 */

const handleTipoChange = (/** @type {{ target: { value: any; }; }} */ e) => {
  const valorSelecionado = e.target.value;

  if (!tipoJurisdicoesMap[valorSelecionado]) {
    message.error('Opção de tipo selecionada inválida!');
    return;
  }

  const valorRadioGroup = tipoJurisdicoesMap[valorSelecionado];
  setTipoSelecionado(valorRadioGroup); // Atualiza o estado tipoSelecionado
  setTipoSelecionadoTemp(valorRadioGroup);

  let formatoInput = '';
  switch (valorRadioGroup) {
    // ... (código restante)
  }

  // ... (código restante)
};

// 3. Agora, modifique a função `renderComponentesInput` para usar o estado `tipoSelecionado` em vez de `tipoSelecionadoTemp`:

const renderComponentesInput = () => {
  if (selecionaTipo === 'matriculas') {
    return (
      <InputFunciSuspensao
        value={tipoInputValue}
        tipoSelecionado={tipoSelecionado} // Altere esta linha
      />
    );
  }
  return (
    <InputPrefixoAlcada
      value={tipoInputValue}
      tipoSelecionado={tipoSelecionado} // Altere esta linha
      ref={tipoInputRef}
    />
  );
};

/** 
 * 4. Por fim, modifique a regra de validação no `Form.Item` para verificar o estado `tipoSelecionado` ao invés de 
 * `tipoSelecionadoTemp`:
 */

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
        const tipoSelecionado = tipoSelecionado; // Altere esta linha
        if (tipoSelecionado === 'matriculas') {
          if (/^F\d{7}$/.test(value)) {
            return Promise.resolve();
          }
          return Promise.reject('Formato de matrícula inválido!');
        }

        if (!value || validaJurisdicao.includes(value)) {
          return Promise.resolve();
        }

        if (!tipoSelecionado) {
          return Promise.resolve();
        }

        const chaveJurisdicao = tipoSelecionado;
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
  {renderComponentesInput()}
</Form.Item>

Dessa forma, sempre que o usuário selecionar uma nova opção no `Radio.Group`, o estado `tipoSelecionado` será atualizado, e a renderização e a validação serão ajustadas de acordo com a opção escolhida. Isso garantirá que o `Radio.Group` seja atualizado corretamente e que a seleção seja reiniciada ao escolher uma nova opção.